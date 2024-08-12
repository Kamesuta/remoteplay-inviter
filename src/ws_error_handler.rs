use anyhow::{anyhow, Context as _, Result};
use indoc::printdoc;
use tokio_tungstenite::tungstenite::Error as WsError;

use crate::{ConnectionErrorMessage, ConnectionErrorType, VERSION};

pub fn handle_ws_error(err: WsError) -> Result<()> {
    match err {
        // Bad Requestの場合
        WsError::Http(res) if res.status() == 400 => {
            let result: Result<()> = try {
                // レスポンスボディを取得
                let header = res
                    .headers()
                    .get("X-Error")
                    .context("Connection refused without error message")?;
                let text = header
                    .to_str()
                    .context("Connection refused with invalid error message")?;
                // JSONをパース
                let ConnectionErrorMessage { message, error } =
                    serde_json::from_str::<ConnectionErrorMessage>(&text)
                        .context("Connection refused with invalid JSON")?;
                // パースに成功した場合
                match error {
                    // バージョンが古い場合
                    ConnectionErrorType::Outdated { required, download } => {
                        // 内容を表示
                        printdoc! {"

                            ↑ Update required: {VERSION} to {required}
                              Download: {download}
                            
                            "};

                        // ブラウザを開く
                        let _ = webbrowser::open(&download);
                    }
                    // その他のエラーの場合
                    _ => {
                        if let Some(message) = message {
                            // メッセージをインデント
                            let message = message
                                .lines()
                                .map(|line| format!("  {}", line))
                                .collect::<Vec<String>>()
                                .join("\n");

                            // エラーメッセージを表示
                            printdoc! {
                                "

                                    ☓ Connection error:
                                    {message}

                                    "
                            }
                        }
                    }
                }
            };

            if let Err(err) = result {
                // パースに失敗した場合
                eprintln!("☓ {err}");
            }
        }
        // その他HTTPエラーの場合
        WsError::Http(res) => Err(anyhow!("HTTP error: {}", res.status()))?,
        // その他のエラーの場合
        _ => Err(err).context("Failed to connect to the server")?,
    }

    Ok(())
}
