#![feature(try_blocks)]

use std::{collections::HashMap, sync::Arc};

use anyhow::{anyhow, Context as _, Result};
use futures::SinkExt;
use futures_util::stream::StreamExt;
use indoc::printdoc;
use serde::{Deserialize, Serialize};
use steam_stuff::{GameID, GameUID, SteamStuff};
use tokio::time::timeout;
use tokio::{
    sync::{mpsc::channel, Mutex},
    task,
    time::{self, Duration},
};
use tokio_tungstenite::tungstenite::Error as WsError;
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

// アップデートが必要な場合のメッセージ
#[derive(Serialize, Deserialize)]
struct UpdateRequired {
    required: String,
    download: String,
}

// JSONデータを表す構造体
#[derive(Serialize, Deserialize)]
#[serde(tag = "cmd")]
enum ServerCmd {
    #[serde(rename = "message")]
    Message { data: String },
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
    user: Option<User>,
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

// リトライ秒数
struct RetrySec(u64);
impl RetrySec {
    fn new() -> Self {
        Self(1)
    }

    fn next(&mut self) -> u64 {
        self.0 = self.0.min(60) * 2;
        self.0
    }

    fn reset(&mut self) {
        self.0 = 1;
    }
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
        SteamStuff::new().context("☓ Failed to initialize SteamStuff")?,
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
                    "-> User Joined        : claimer={user_name}, guest_id={guest_id}, steam_id={invitee}",
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
                    "-> User Left          : claimer={user_name}, guest_id={guest_id}, steam_id={invitee}",
                );
            });
        });
        steam.set_on_remote_invited(move |_invitee, guest_id, connect_url| {
            // 招待リンクを送信
            let invite_tx = invite_tx.clone();
            let connect_url = String::from(connect_url);
            tokio::spawn(async move {
                invite_tx.send((guest_id, connect_url)).await.unwrap();
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

    // バージョン
    let version = "1.1.1";
    // UUID
    let uuid = "abc";
    // 再接続フラグ
    let mut reconnect = false;
    // リトライ秒数
    let mut retry_sec = RetrySec::new();

    // イベントループ
    loop {
        let result: Result<()> = try {
            // URLを作成
            let url = format!("ws://localhost:8000/?token={uuid}&v={version}");

            // 再接続時のメッセージを表示
            if reconnect {
                println!("↪ Reconnecting to the server...");
            }

            // WebSocketクライアントを作成
            let connect_result = timeout(Duration::from_secs(10), connect_async(url))
                .await
                .context("Connection timed out to the server")?;
            let ws_stream = match connect_result {
                Ok((ws_stream, _)) => ws_stream,
                Err(err) => {
                    match err {
                        // バージョンが古い場合
                        WsError::Http(res) if res.status() == 426 => {
                            // レスポンスボディを取得
                            let res = res
                                .into_body()
                                // バイト列を文字列に変換
                                .map(|b| String::from_utf8_lossy(&b).to_string())
                                // JSONをパース
                                .map(|b| serde_json::from_str::<UpdateRequired>(&b));
                            // パースに成功した場合
                            if let Some(Ok(UpdateRequired { required, download })) = res {
                                // 内容を表示
                                printdoc! {
                                    "
                                    ↑ Update required: {version} to {required}
                                      Download: {download}
                                    "
                                };
                            } else {
                                // パースに失敗した場合
                                eprintln!("↑ Update required: Download the latest version from the website");
                            }
                            return Ok(());
                        }
                        // その他HTTPエラーの場合
                        WsError::Http(res) => Err(anyhow!("HTTP error: {}", res.status()))?,
                        // その他のエラーの場合
                        _ => Err(err).context("Failed to connect to the server")?,
                    }
                }
            };

            // サーバーと通信するためのストリームとシンク
            let (mut write, mut read) = ws_stream.split();

            // 再接続時のメッセージを表示
            if reconnect {
                println!("✓ Reconnected!");
            } else {
                println!("✓ Connected to the server!");
            }

            // サーバーから受信したメッセージを処理するループ
            'msgloop: while let Some(message) = timeout(Duration::from_secs(60), read.next())
                .await
                .context("Connection timed out")?
            {
                // メッセージごとに分岐して処理
                match message.context("Failed to receive message from the server")? {
                    Message::Close(_) => break,
                    Message::Ping(ping) => {
                        write
                            .send(Message::Pong(ping))
                            .await
                            .context("Failed to send pong message to the server")?;
                        retry_sec.reset();
                    }
                    Message::Text(text) => {
                        // JSONデータをパース
                        let msg: ServerMessage = serde_json::from_str(&text)
                            .context("Failed to deserialize JSON message from the server")?;
                        // コマンドタイプによって分岐
                        let res = 'res: {
                            match msg.cmd {
                                ServerCmd::Message { data } => {
                                    // メッセージをインデント
                                    let message = data
                                        .lines()
                                        .map(|line| format!("  {}", line))
                                        .collect::<Vec<String>>()
                                        .join("\n");
                                    // Welcomeメッセージを表示
                                    printdoc!(
                                        "
                                        
                                        {message}
                    
                                        "
                                    );
                                    continue 'msgloop;
                                }
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
                                    let claimer =
                                        msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
                                    println!(
                                        "-> Create Panel       : claimer={claimer}, game_id={0}",
                                        game_id.app_id
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
                                    let (guest_id, connect_url) = recv.await.unwrap();

                                    // Discordのユーザーとguest_idを紐付け
                                    if let Some(user) = &msg.user {
                                        guest_map.lock().await.insert(guest_id, user.name.clone());
                                    }

                                    // ログを出力
                                    let claimer =
                                        msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
                                    println!(
                                        "-> Create Invite Link : claimer={claimer}, guest_id={guest_id}, game_id={game}, invite_url={connect_url}", 
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
                        let res_str = serde_json::to_string(&res)
                            .context("Failed to serialize JSON message for the server")?;
                        // レスポンスデータを送信
                        write
                            .send(Message::Text(res_str))
                            .await
                            .context("Failed to send message to the server")?;

                        retry_sec.reset();
                    }
                    _ => (),
                }
            }
        };
        if let Err(err) = result {
            eprintln!("☓ {}", err);
        }

        // サーバーとの接続が切れた場合、再接続する
        let sec = retry_sec.next();
        println!("↪ Connection lost. Reconnecting in {sec} seconds...");
        time::sleep(Duration::from_secs(sec)).await;
        reconnect = true;
    }
}
