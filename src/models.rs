use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionErrorMessage {
    pub message: Option<String>,
    #[serde(flatten)]
    pub error: ConnectionErrorType,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "error")]
pub enum ConnectionErrorType {
    #[serde(rename = "outdated")]
    Outdated { required: String, download: String },
    #[serde(other)]
    Other,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServerMessage {
    pub id: String,
    pub user: Option<User>,
    #[serde(flatten)]
    pub cmd: ServerCmd,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "cmd")]
pub enum ServerCmd {
    #[serde(rename = "message")]
    Message { text: String, copy: Option<String> },
    #[serde(rename = "game")]
    GameId,
    #[serde(rename = "link")]
    Link { game: u32 },
    #[serde(rename = "exit")]
    Exit,
    #[serde(other)]
    Invalid,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientMessage {
    pub id: String,
    #[serde(flatten)]
    pub cmd: ClientCmd,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "cmd")]
pub enum ClientCmd {
    #[serde(rename = "game")]
    GameId { game: u32 },
    #[serde(rename = "link")]
    Link { url: String },
    #[serde(rename = "error")]
    Error { code: ErrorStatus },
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ErrorStatus {
    /** The command is invalid */
    InvalidCmd,
    /** The app is not running */
    InvalidApp,
}
