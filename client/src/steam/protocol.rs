//! Line protocol between the main process and the per-game helper process.
//! Each message is a single line of JSON on stdin (requests) or stdout (events).

use serde::{Deserialize, Serialize};

/// Requests sent from the main process to the helper
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "cmd", rename_all = "snake_case")]
pub enum HelperRequest {
    /// Create a guest invite link
    Link,
    /// Shut down the helper
    Quit,
}

/// Events sent from the helper to the main process
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "snake_case")]
pub enum HelperEvent {
    /// Steam API is initialized and requests can be accepted
    Ready,
    /// A guest invite link was created.
    /// Guest IDs are assigned in the order the invites are created,
    /// so `guestid` is the ID the guest will get when they join.
    Link { url: String, guestid: u32 },
    /// The invite could not be created
    LinkFailed,
    /// A player joined the session
    Joined {
        steamid: u64,
        guestid: u32,
        rpt: bool,
    },
    /// A player left the session
    Left { steamid: u64, guestid: u32 },
    /// A fatal error occurred
    Error { msg: String },
}

/// Serializes a message into a single line (without the trailing newline)
pub fn to_line<T: Serialize>(msg: &T) -> String {
    // Serializing these enums cannot fail
    serde_json::to_string(msg).expect("protocol messages are always serializable")
}

/// Parses a line, ignoring anything that is not a protocol message.
/// The Steam API library writes its own log lines to stdout, so those must be skipped.
/// A message may also be appended to an unterminated log line, so parsing starts at the first `{"`.
pub fn parse_line<T: for<'de> Deserialize<'de>>(line: &str) -> Option<T> {
    let start = line.find("{\"")?;
    serde_json::from_str(line[start..].trim_end()).ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn request_round_trip() {
        for req in [HelperRequest::Link, HelperRequest::Quit] {
            assert_eq!(parse_line::<HelperRequest>(&to_line(&req)), Some(req));
        }
        assert_eq!(to_line(&HelperRequest::Link), r#"{"cmd":"link"}"#);
    }

    #[test]
    fn event_round_trip() {
        let events = [
            HelperEvent::Ready,
            HelperEvent::Link {
                url: "https://s.team/remoteplay/connect/abc".into(),
                guestid: 1,
            },
            HelperEvent::LinkFailed,
            HelperEvent::Joined {
                steamid: 76561198000000000,
                guestid: 1,
                rpt: true,
            },
            HelperEvent::Left {
                steamid: 76561198000000000,
                guestid: 1,
            },
            HelperEvent::Error { msg: "x".into() },
        ];
        for ev in events {
            assert_eq!(parse_line::<HelperEvent>(&to_line(&ev)), Some(ev));
        }
        assert_eq!(
            to_line(&HelperEvent::LinkFailed),
            r#"{"event":"link_failed"}"#
        );
    }

    #[test]
    fn non_protocol_lines_are_ignored() {
        assert_eq!(
            parse_line::<HelperEvent>("[S_API] SteamAPI_Init(): Loaded 'steamclient' OK."),
            None
        );
        assert_eq!(
            parse_line::<HelperEvent>("Setting breakpad minidump AppID = 1"),
            None
        );
        assert_eq!(parse_line::<HelperEvent>(""), None);
        assert_eq!(parse_line::<HelperEvent>(r#"{"event":"unknown"}"#), None);
        assert_eq!(
            parse_line::<HelperEvent>("  {\"event\":\"ready\"}\r"),
            Some(HelperEvent::Ready)
        );
    }

    #[test]
    fn message_after_partial_log_line() {
        assert_eq!(
            parse_line::<HelperEvent>(r#"[S_API] partial log{"event":"link_failed"}"#),
            Some(HelperEvent::LinkFailed)
        );
    }
}
