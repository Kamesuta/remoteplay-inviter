use anyhow::{Context as _, Result};
use futures::SinkExt;
use futures_util::stream::StreamExt;
use serde::{Deserialize, Serialize};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

// JSONデータを表す構造体
#[derive(Serialize, Deserialize)]
struct Msg {
    jsonrpc: String,
    id: u32,
    method: String,
    params: Params,
}

// パラメーターを表す構造体
#[derive(Serialize, Deserialize)]
struct Params {
    channels: Vec<String>,
}

#[tokio::main]
async fn main() -> Result<()> {
    // JSONデータを作成
    let msg = Msg {
        jsonrpc: "2.0".to_string(),
        id: 8,
        method: "public/subscribe".to_string(),
        params: Params {
            channels: vec!["book.BTC-10MAR23-25500-P.100ms".to_string()],
        },
    };

    // JSONデータを文字列に変換
    let msg_str = serde_json::to_string(&msg).context("Failed to serialize")?;

    // WebSocketクライアントを作成
    let (ws_stream, _) = connect_async("wss://www.deribit.com/ws/api/v2")
        .await
        .context("Failed to connect")?;
    // サーバーと通信するためのストリームとシンク
    let (mut write, mut read) = ws_stream.split();

    // JSONデータを送信
    write
        .send(Message::Text(msg_str))
        .await
        .context("Failed to send")?;

    // サーバーから受信したメッセージを処理するループ
    while let Some(message) = read.next().await {
        match message.context("Failed to receive")? {
            Message::Close(_) => break,
            Message::Ping(ping) => write.send(Message::Pong(ping)).await.unwrap(),
            Message::Text(text) => println!("{}", text), // レスポンスを表示
            _ => (),
        }
    }

    Ok(())
}

// use steam_stuff::{SteamStuff_Init, SteamStuff_Shutdown};

// fn main() {
//     unsafe {
//         SteamStuff_Init();
//         SteamStuff_Shutdown();
//     }
//     println!("Hello, world!");
// }
