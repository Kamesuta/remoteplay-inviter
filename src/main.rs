use anyhow::{Context as _, Result};
use futures::SinkExt;
use futures_util::stream::StreamExt;
use serde::{Deserialize, Serialize};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

// JSONデータを表す構造体
#[derive(Serialize, Deserialize)]
struct ServerMessage {
    id: String,
    cmd: String,
    user: String,
}

#[derive(Serialize, Deserialize)]
struct PanelData {
    game: GameData,
}

#[derive(Serialize, Deserialize)]
struct GameData {
    name: String,
    store: String,
    image: String,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "cmd")]
enum ClientMessage {
    #[serde(rename = "panel")]
    Panel { id: String, data: PanelData },
    #[serde(rename = "link")]
    Link { id: String, data: String },
}

#[tokio::main]
async fn main() -> Result<()> {
    // WebSocketクライアントを作成
    let (ws_stream, _) = connect_async(format!(
        "ws://localhost:8000/?token={}&ver={}",
        "abc", "1.0"
    ))
    .await
    .context("Failed to connect")?;
    // サーバーと通信するためのストリームとシンク
    let (mut write, mut read) = ws_stream.split();

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
                let res = match msg.cmd.as_str() {
                    "panel" => {
                        // パネルデータを作成
                        let panel_data = PanelData {
                            game: GameData {
                                name: "Overcooked! 2".to_string(),
                                store: "https://store.steampowered.com/app/728880/Overcooked_2/".to_string(),
                                image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/728880/header.jpg?t=1718623620".to_string(),
                            }
                        };
                        // レスポンスデータを作成
                        ClientMessage::Panel {
                            id: msg.id,
                            data: panel_data,
                        }
                    }
                    "link" => {
                        // リンクデータを作成
                        let link_data = "https://kamesuta.com".to_string();
                        // レスポンスデータを作成
                        ClientMessage::Link {
                            id: msg.id,
                            data: link_data,
                        }
                    }
                    _ => continue, // 未知のコマンドは無視 TODO: サーバーにエラーを返す
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

// use steam_stuff::{SteamStuff_Init, SteamStuff_Shutdown};

// fn main() {
//     unsafe {
//         SteamStuff_Init();
//         SteamStuff_Shutdown();
//     }
//     println!("Hello, world!");
// }
