#![feature(try_blocks)]

use std::{collections::HashMap, sync::Arc};

use anyhow::{anyhow, Context as _, Result};
use dotenvy_macro::dotenv;
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
use tokio_tungstenite::tungstenite::http::uri::Builder;
use tokio_tungstenite::tungstenite::http::Uri;
use tokio_tungstenite::tungstenite::Error as WsError;
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};
use uuid::Uuid;

mod config;
mod models;

use config::{read_or_generate_config, Config};
use models::*;

// バージョン
const VERSION: &'static str = env!("CARGO_PKG_VERSION");

// Endpoint URL
const DEFAULT_URL: &'static str = dotenv!("ENDPOINT_URL");

// アップデートが必要な場合のメッセージ
#[derive(Serialize, Deserialize)]
struct UpdateRequired {
    required: String,
    download: String,
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

    // 再接続フラグ
    let mut reconnect = false;
    // リトライ秒数
    let mut retry_sec = RetrySec::new();

    // イベントループ
    'main: {
        // UUID
        let result: Result<String> = try {
            // 設定ファイルを読み込む (存在しない場合は生成)
            let config = read_or_generate_config(|| Config {
                uuid: Uuid::new_v4().to_string(),
                url: None,
            })?;

            // URLを作成
            let endpoint_url = config.url.unwrap_or(DEFAULT_URL.to_string());
            let uri: Uri = endpoint_url.parse().context("Failed to parse URL")?;
            let uri = Builder::from(uri)
                .path_and_query(format!("/ws?token={0}&v={VERSION}", config.uuid))
                .build()
                .context("Failed to build URL")?;
            uri.to_string()
        };
        let url = match result {
            Ok(url) => url,
            Err(err) => {
                eprintln!("☓ {}", err);
                break 'main;
            }
        };

        loop {
            let result: Result<()> = try {
                // 再接続時のメッセージを表示
                if reconnect {
                    println!("↪ Reconnecting to the server...");
                }

                // WebSocketクライアントを作成
                let connect_result = timeout(Duration::from_secs(10), connect_async(&url))
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
                                    printdoc! {"

                                    ↑ Update required: {VERSION} to {required}
                                      Download: {download}
                                    
                                    "};
                                } else {
                                    // パースに失敗した場合
                                    eprintln!("↑ Update required: Download the latest version from the website");
                                }
                                break 'main;
                            }
                            // Bad Requestの場合
                            WsError::Http(res) if res.status() == 400 => {
                                // レスポンスボディを取得
                                let res = res
                                    .into_body()
                                    // バイト列を文字列に変換
                                    .map(|b| String::from_utf8_lossy(&b).to_string())
                                    // またはデフォルトのエラーメッセージ
                                    .unwrap_or_else(|| "Bad Request".to_string());
                                // 内容を表示
                                eprintln!("☓ {}", res);
                                break 'main;
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
                                        printdoc! {"

                                        {message}
                    
                                        "};
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
                                            guest_map
                                                .lock()
                                                .await
                                                .insert(guest_id, user.name.clone());
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
                                    ServerCmd::Exit => {
                                        // アプリを終了
                                        return Ok(());
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

    // 入力があるまで待機
    println!("□ Press Ctrl+C to exit...");
    let _ = tokio::signal::ctrl_c().await;

    Ok(())
}
