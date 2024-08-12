use crate::{ConnectionErrorMessage, ConnectionErrorType, VERSION};
use anyhow::{anyhow, Context as _, Result};
use indoc::printdoc;
use tokio_tungstenite::tungstenite::Error as WsError;

/// Handle WebSocket errors
pub fn handle_ws_error(err: WsError) -> Result<()> {
    match err {
        // In case of Bad Request
        WsError::Http(res) if res.status() == 400 => {
            let result: Result<()> = try {
                // Get the response body
                let header = res
                    .headers()
                    .get("X-Error")
                    .context("Connection refused without error message")?;
                let text = header
                    .to_str()
                    .context("Connection refused with invalid error message")?;
                // Parse JSON
                let ConnectionErrorMessage { message, error } =
                    serde_json::from_str::<ConnectionErrorMessage>(text)
                        .context("Connection refused with invalid JSON")?;
                // If parsing is successful
                match error {
                    // If the version is outdated
                    ConnectionErrorType::Outdated { required, download } => {
                        // Display the content
                        printdoc! {"

                            ↑ Update required: {VERSION} to {required}
                              Download: {download}
                            
                            "};

                        // Open the browser
                        let _ = webbrowser::open(&download);
                    }
                    // For other errors
                    _ => {
                        if let Some(message) = message {
                            // Indent the message
                            let message = message
                                .lines()
                                .map(|line| format!("  {}", line))
                                .collect::<Vec<String>>()
                                .join("\n");

                            // Display the error message
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
                // If parsing fails
                eprintln!("☓ {err}");
            }
        }
        // For other HTTP errors
        WsError::Http(res) => Err(anyhow!("HTTP error: {}", res.status()))?,
        // For other errors
        _ => Err(err).context("Failed to connect to the server")?,
    }

    Ok(())
}
