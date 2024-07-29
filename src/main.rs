use anyhow::{Context as _, Result};
use futures::SinkExt;
use futures_util::stream::StreamExt;
use indoc::printdoc;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};
use steam_stuff::{GameID, GameUID, SteamStuff};
use tokio::{
    sync::{mpsc::channel, Mutex},
    task,
    time::{self, Duration},
};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

// JSONデータを表す構造体
#[derive(Serialize, Deserialize)]
#[serde(tag = "cmd")]
enum ServerCmd {
    #[serde(rename = "game")]
    GameId,
    #[serde(rename = "link")]
    Link { game: u32 },
    #[serde(other)]
    Invalid,
}

#[derive(Serialize, Deserialize)]
struct User {
    id: String,
    name: String,
}

#[derive(Serialize, Deserialize)]
struct ServerMessage {
    id: String,
    user: User,
    #[serde(flatten)]
    cmd: ServerCmd,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum ErrorStatus {
    /** The command is invalid */
    InvalidCmd,
    /** The app is not running */
    InvalidApp,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "cmd")]
enum ClientCmd {
    #[serde(rename = "game")]
    GameId { data: u32 },
    #[serde(rename = "link")]
    Link { data: String },
    #[serde(rename = "error")]
    Error { data: ErrorStatus },
}

#[derive(Serialize, Deserialize)]
struct ClientMessage {
    id: String,
    #[serde(flatten)]
    cmd: ClientCmd,
}

#[tokio::main]
async fn main() -> Result<()> {
    printdoc! {"
        ------------------------------------------------------------------------------
                    ╦═╗┌─┐┌┬┐┌─┐┌┬┐┌─┐┌─┐┬  ┌─┐┬ ┬  ╦┌┐┌┬  ┬┬┌┬┐┌─┐┬─┐
                    ╠╦╝├┤ ││││ │ │ ├┤ ├─┘│  ├─┤└┬┘  ║│││└┐┌┘│ │ ├┤ ├┬┘
                    ╩╚═└─┘┴ ┴└─┘ ┴ └─┘┴  ┴─┘┴ ┴ ┴   ╩┘└┘ └┘ ┴ ┴ └─┘┴└─
                                                    by Kamesuta
            Invite your friends via Discord and play Steam games together for free! 
        ------------------------------------------------------------------------------
    
    "};

    // SteamStuffを初期化
    let steam = Arc::new(Mutex::new(
        SteamStuff::new().context("Failed to initialize SteamStuff")?,
    ));

    // 同期オブジェクト (Stringを渡す)
    let (invite_tx, mut invite_rx) = channel::<(u64, String)>(32);

    // guest_id → Discordのユーザー のマッピング
    let guest_map = Arc::new(Mutex::new(HashMap::<u64, String>::new()));

    // コールバックを登録
    {
        let steam = steam.lock().await;
        let guests = guest_map.clone();
        steam.set_on_remote_started(move |invitee, guest_id| {
            let guests = guests.clone();
            tokio::spawn(async move {
                let guest_map = guests.lock().await;
                let user_name = guest_map.get(&guest_id).map_or_else(|| "?", |s| &s);
                println!(
                    "-> User Joined        : claimer={}, guest_id={}, steam_id={}",
                    user_name, guest_id, invitee
                );
            });
        });
        let guests = guest_map.clone();
        steam.set_on_remote_stopped(move |invitee, guest_id| {
            let guests = guests.clone();
            tokio::spawn(async move {
                let guest_map = guests.lock().await;
                let user_name = guest_map.get(&guest_id).map_or_else(|| "?", |s| &s);
                println!(
                    "-> User Left          : claimer={}, guest_id={}, steam_id={}",
                    user_name, guest_id, invitee
                );
            });
        });
        steam.set_on_remote_invited(move |_invitee, guest_id, connect_url| {
            // 招待リンクを送信
            let invite_tx = invite_tx.clone();
            let connect_url = String::from(connect_url);
            tokio::spawn(async move {
                if let Err(err) = invite_tx.send((guest_id, connect_url)).await {
                    eprintln!("Failed to send invite link: {}", err);
                }
            });
        });
    }

    // SteamStuff_RunCallbacksを定期的に呼び出すタスクを開始
    {
        let steam = steam.clone();
        task::spawn(async move {
            let mut interval = time::interval(Duration::from_millis(200));
            loop {
                interval.tick().await;
                steam.lock().await.run_callbacks();
            }
        });
    }

    let uuid = "abc";

    // WebSocketクライアントを作成
    let (ws_stream, _) =
        connect_async(format!("ws://localhost:8000/?token={}&ver={}", uuid, "1.0"))
            .await
            .context("Failed to connect")?;
    // サーバーと通信するためのストリームとシンク
    let (mut write, mut read) = ws_stream.split();

    printdoc!(
        "
        Type `/steam setup {}` to link your Discord account.
        
        ",
        uuid
    );

    // サーバーから受信したメッセージを処理するループ
    while let Some(message) = read.next().await {
        match message.context("Failed to receive")? {
            Message::Close(_) => break,
            Message::Ping(ping) => write.send(Message::Pong(ping)).await.unwrap(),
            Message::Text(text) => {
                // JSONデータをパース
                let msg: ServerMessage =
                    serde_json::from_str(&text).context("Failed to deserialize")?;
                // コマンドタイプによって分岐
                let res = 'res: {
                    match msg.cmd {
                        ServerCmd::GameId => {
                            let game_id = steam.lock().await.get_running_game_id();

                            // ゲームが実行されていない場合
                            if !game_id.is_valid_app() {
                                // レスポンスデータを作成
                                break 'res ClientMessage {
                                    id: msg.id,
                                    cmd: ClientCmd::Error {
                                        data: ErrorStatus::InvalidApp,
                                    },
                                };
                            }

                            // ログを出力
                            println!(
                                "-> Create Panel       : claimer={}, game_id={}",
                                msg.user.name, game_id.app_id
                            );

                            // レスポンスデータを作成
                            ClientMessage {
                                id: msg.id,
                                cmd: ClientCmd::GameId {
                                    data: game_id.app_id,
                                },
                            }
                        }
                        ServerCmd::Link { game } => {
                            // ゲームIDを取得
                            let game_uid: GameUID = GameID::new(game, 0, 0).into();

                            // 招待リンクを作成
                            let recv = invite_rx.recv();
                            steam.lock().await.send_invite(0, game_uid);
                            let (guest_id, connect_url) =
                                recv.await.context("Failed to receive")?;

                            // Discordのユーザーとguest_idを紐付け
                            guest_map
                                .lock()
                                .await
                                .insert(guest_id, msg.user.name.clone());

                            // ログを出力
                            println!(
                                "-> Create Invite Link : claimer={}, guest_id={}, game_id={}, invite_url={}",
                                msg.user.name, guest_id, game, connect_url
                            );

                            // レスポンスデータを作成
                            ClientMessage {
                                id: msg.id,
                                cmd: ClientCmd::Link { data: connect_url },
                            }
                        }
                        ServerCmd::Invalid => {
                            // レスポンスデータを作成
                            ClientMessage {
                                id: msg.id,
                                cmd: ClientCmd::Error {
                                    data: ErrorStatus::InvalidCmd,
                                },
                            }
                        }
                    }
                };

                // レスポンスデータをJSONに変換
                let res_str = serde_json::to_string(&res).context("Failed to serialize")?;
                // レスポンスデータを送信
                write
                    .send(Message::Text(res_str))
                    .await
                    .context("Failed to send")?;
            }
            _ => (),
        }
    }

    Ok(())
}
