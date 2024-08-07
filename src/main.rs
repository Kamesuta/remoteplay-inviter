#![feature(try_blocks)]

use anyhow::{Context as _, Result};
use dotenvy_macro::dotenv;
use futures::SinkExt;
use futures_util::stream::StreamExt;
use indoc::printdoc;
use std::{collections::HashMap, sync::Arc};
use steam_stuff::SteamStuff;
use tokio::{
    sync::{mpsc::channel, Mutex},
    time::{self, timeout, Duration},
};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{
        http::{uri::Builder, Uri},
        protocol::Message,
    },
};
use uuid::Uuid;

mod config;
mod handlers;
mod models;
mod retry;
mod ws_error_handler;

use config::{read_or_generate_config, Config};
use handlers::{handle_server_message, run_steam_callbacks, setup_steam_callbacks};
use models::*;
use retry::RetrySec;
use ws_error_handler::handle_ws_error;

// バージョン
pub const VERSION: &'static str = env!("CARGO_PKG_VERSION");

// Endpoint URL
const DEFAULT_URL: &'static str = dotenv!("ENDPOINT_URL");

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
    setup_steam_callbacks(&steam, &guest_map, invite_tx.clone()).await;
    // コールバックを定期的に呼び出すタスクを開始
    run_steam_callbacks(&steam);

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
                        handle_ws_error(err)?;
                        // OKが返ってきた場合は、ループを抜けて終了
                        break 'main;
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
                while let Some(message) = timeout(Duration::from_secs(60), read.next())
                    .await
                    .context("Connection timed out")?
                {
                    // メッセージごとに分岐して処理
                    match message.context("Failed to receive message from the server")? {
                        Message::Close(_) => break,
                        Message::Ping(ping) => {
                            // Pongメッセージを送信
                            write
                                .send(Message::Pong(ping))
                                .await
                                .context("Failed to send pong message to the server")?;

                            // リトライ秒数をリセット
                            retry_sec.reset();
                        }
                        Message::Text(text) => {
                            // JSONデータをパース
                            let msg: ServerMessage = serde_json::from_str(&text)
                                .context("Failed to deserialize JSON message from the server")?;

                            // メッセージを処理
                            if handle_server_message(
                                msg,
                                &steam,
                                &mut invite_rx,
                                &guest_map,
                                &mut write,
                            )
                            .await?
                            {
                                // 終了フラグが立っている場合、ループを抜けて終了
                                break 'main;
                            }

                            // リトライ秒数をリセット
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
