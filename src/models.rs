use serde::{Deserialize, Serialize};

// アップデートが必要な場合のメッセージ
#[derive(Serialize, Deserialize)]
pub struct UpdateRequired {
    pub required: String,
    pub download: String,
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
    Message { data: String },
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
    GameId { data: u32 },
    #[serde(rename = "link")]
    Link { data: String },
    #[serde(rename = "error")]
    Error { data: ErrorStatus },
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
