use anyhow::{anyhow, Context as _, Result};
use indoc::printdoc;
use serde::{Deserialize, Serialize};
use tokio_tungstenite::tungstenite::Error as WsError;

use crate::VERSION;

// アップデートが必要な場合のメッセージ
#[derive(Serialize, Deserialize)]
struct UpdateRequired {
    required: String,
    download: String,
}

pub fn handle_ws_error(err: WsError) -> Result<()> {
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
        }
        // その他HTTPエラーの場合
        WsError::Http(res) => Err(anyhow!("HTTP error: {}", res.status()))?,
        // その他のエラーの場合
        _ => Err(err).context("Failed to connect to the server")?,
    }

    Ok(())
}
