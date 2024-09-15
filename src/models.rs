use serde::{Deserialize, Serialize};

/// Connection error message
#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionErrorMessage {
    /// Error message
    pub message: Option<String>,
    #[serde(flatten)]
    pub error: ConnectionErrorType,
}

/// Error types for the daemon server
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "error")]
pub enum ConnectionErrorType {
    /// Outdated daemon
    #[serde(rename = "outdated")]
    Outdated {
        /// Required version
        required: String,
        /// Download URL
        download: String,
    },
    #[serde(other)]
    Other,
}

/// A data structure to represent a request to the daemon
#[derive(Debug, Serialize, Deserialize)]
pub struct ServerMessage {
    /// Request ID
    pub id: String,
    /// Request user
    pub user: Option<User>,
    /// Request type
    #[serde(flatten)]
    pub cmd: ServerCmd,
}

/// Request Type
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "cmd")]
pub enum ServerCmd {
    /// Announce message
    #[serde(rename = "message")]
    Message {
        /// Message text
        text: String,
        /// Text to copy to clipboard
        copy: Option<String>,
    },
    /// Generate a game id
    #[serde(rename = "game")]
    GameId,
    /// Generate a link request
    #[serde(rename = "link")]
    Link {
        /// Game ID
        game: u32,
    },
    /// Exit request
    #[serde(rename = "exit")]
    Exit,
    #[serde(other)]
    Invalid,
}

/// A data structure to represent a response from the daemon
#[derive(Debug, Serialize, Deserialize)]
pub struct ClientMessage {
    /// Request ID
    pub id: String,
    /// Request type
    #[serde(flatten)]
    pub cmd: ClientCmd,
}

/// Request Type
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "cmd")]
pub enum ClientCmd {
    /// Generate a game id
    #[serde(rename = "game")]
    GameId {
        /// Game ID
        game: u32,
    },
    /// Generate a link request
    #[serde(rename = "link")]
    Link {
        /// Invite URL
        url: String,
    },
    /// Error response
    #[serde(rename = "error")]
    Error {
        /// Error code
        code: ErrorStatus,
    },
}

/// User information
#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
}

/// Error statuses
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ErrorStatus {
    /// The command is invalid
    InvalidCmd,
    /// The app is not running
    InvalidApp,
    /// The app does not support remote play
    UnsupportedApp,
}
