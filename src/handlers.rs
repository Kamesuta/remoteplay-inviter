use anyhow::{Context, Result};
use clipboard::{ClipboardContext, ClipboardProvider};
use futures::SinkExt;
use std::{
    collections::{BTreeMap, HashMap, VecDeque},
    sync::Arc,
};
use tokio::sync::{mpsc::UnboundedReceiver, Mutex};
use tokio_tungstenite::tungstenite::{protocol::Message, Error as WsError};

use crate::{
    console,
    models::{ClientCmd, ClientMessage, ErrorStatus, ServerCmd, ServerMessage},
    steam::{SessionEvent, SteamManager},
};

/// Players in the Remote Play session
#[derive(Default)]
pub struct GuestData {
    /// Discord user names by guest ID
    pub guest_map: HashMap<u32, String>,
    /// Connected players (key: guest ID, or Steam ID for friends) with their guest ID
    pub players: BTreeMap<u64, u32>,
    /// Discord user names of invite links that have not been used yet
    pub pending_claimers: VecDeque<String>,
}

impl GuestData {
    /// Key to identify a player (friends join with guest ID 0)
    fn player_key(steamid: u64, guestid: u32) -> u64 {
        if guestid != 0 {
            guestid as u64
        } else {
            steamid
        }
    }

    fn user_name(&self, guestid: u32) -> &str {
        self.guest_map.get(&guestid).map_or("?", |s| s)
    }

    fn players_text(&self) -> String {
        self.players
            .iter()
            .map(|(key, guestid)| format!("[{}]{}", key, self.user_name(*guestid)))
            .collect::<Vec<String>>()
            .join(", ")
    }
}

pub trait MessageResponder {
    // Respond to a message
    async fn send_response(&mut self, msg: ClientMessage) -> Result<()>;
}

impl<T: SinkExt<Message, Error = WsError> + Unpin> MessageResponder for T {
    async fn send_response(&mut self, res: ClientMessage) -> Result<()> {
        // Convert the response data to JSON
        let res_str = serde_json::to_string(&res)
            .context("Failed to serialize JSON message for the server")?;

        // Send the response data
        self.send(Message::Text(res_str))
            .await
            .context("Failed to send message to the server")?;

        Ok(())
    }
}

pub struct Handler {
    steam: Arc<SteamManager>,
    guest_data: Arc<Mutex<GuestData>>,
}

impl Handler {
    pub fn new(steam: Arc<SteamManager>) -> Self {
        Self {
            steam,
            guest_data: Arc::default(),
        }
    }

    /**
     * Handles server messages
     * @return Whether to exit (true: exit)
     */
    pub async fn handle_server_message(
        &mut self,
        msg: ServerMessage,
        responder: &mut impl MessageResponder,
    ) -> Result<bool> {
        // Branch based on command type
        match msg.cmd {
            ServerCmd::Message { text: data, copy } => {
                // Indent the message
                let message = data
                    .lines()
                    .map(|line| format!("  {}", line))
                    .collect::<Vec<String>>()
                    .join("\n");

                // Display the welcome message
                console::printdoc! {"

                {message}

                "};

                // If there is a copy, copy it
                if let Some(copy) = copy {
                    // Copy to clipboard
                    if let Err(_err) = ClipboardProvider::new()
                        .map(|mut ctx: ClipboardContext| ctx.set_contents(copy.clone()))
                    {
                        console::eprintln!("☓ Failed to copy to clipboard: {}", copy);
                    }
                }
            }
            ServerCmd::GameId => {
                let game_id = self.steam.running_game();

                if !game_id.is_valid_app() {
                    // If the game is not running
                    respond_error(responder, msg.id, ErrorStatus::InvalidApp).await?;
                    return Ok(false);
                }

                let app_id = game_id.app_id;

                // Start the helper early so that the invite link is created quickly
                if let Err(err) = self.steam.ensure_helper(app_id).await {
                    console::eprintln!("☓ {err:#}");
                }

                // Log the output
                let claimer = msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
                console::println!(
                    "-> Create Panel       : claimer={claimer}, game_id={0}",
                    app_id
                );

                // Create the response data
                responder
                    .send_response(ClientMessage {
                        id: msg.id,
                        cmd: ClientCmd::GameId { game: app_id },
                    })
                    .await?;
            }
            ServerCmd::Link { game } => {
                // The invite is created for the running game
                if self.steam.running_game().app_id != game {
                    respond_error(responder, msg.id, ErrorStatus::InvalidApp).await?;
                    return Ok(false);
                }

                // Create an invite link
                let connect_url = match self.steam.create_invite_link(game).await {
                    Ok(url) => url,
                    Err(err) => {
                        console::eprintln!("☓ Failed to create an invite link: {err:#}");
                        respond_error(responder, msg.id, ErrorStatus::InviteFailed).await?;
                        return Ok(false);
                    }
                };

                // The guest ID is known only when the guest joins
                let claimer = msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
                self.guest_data
                    .lock()
                    .await
                    .pending_claimers
                    .push_back(claimer.to_string());

                // Log the output
                console::println!(
                    "-> Create Invite Link : claimer={claimer}, game_id={game}, invite_url={connect_url}",
                );

                // Create the response data
                responder
                    .send_response(ClientMessage {
                        id: msg.id,
                        cmd: ClientCmd::Link { url: connect_url },
                    })
                    .await?;
            }
            ServerCmd::Exit => {
                // Exit the application
                return Ok(true);
            }
            ServerCmd::Invalid => {
                respond_error(responder, msg.id, ErrorStatus::InvalidCmd).await?;
            }
        };

        Ok(false)
    }

    // Track players joining and leaving
    pub fn spawn_session_event_task(&self, mut events: UnboundedReceiver<SessionEvent>) {
        let guest_data = self.guest_data.clone();
        tokio::spawn(async move {
            while let Some(event) = events.recv().await {
                let mut guest_data = guest_data.lock().await;
                let _: Result<()> = (|| {
                    match event {
                        SessionEvent::Joined {
                            steamid,
                            guestid,
                            rpt,
                        } => {
                            // Associate the guest with the Discord user who requested the link
                            if rpt && guestid != 0 && !guest_data.guest_map.contains_key(&guestid) {
                                if let Some(claimer) = guest_data.pending_claimers.pop_front() {
                                    guest_data.guest_map.insert(guestid, claimer);
                                }
                            }
                            guest_data
                                .players
                                .insert(GuestData::player_key(steamid, guestid), guestid);

                            // Log the output
                            let user_name = guest_data.user_name(guestid);
                            console::println!(
                                "-> Player Joined        : claimer={user_name}, guest_id={guestid}, steam_id={steamid}",
                            );
                        }
                        SessionEvent::Left { steamid, guestid } => {
                            guest_data
                                .players
                                .remove(&GuestData::player_key(steamid, guestid));

                            // Log the output
                            let user_name = guest_data.user_name(guestid).to_string();
                            console::println!(
                                "-> Player Left          : claimer={user_name}, guest_id={guestid}, steam_id={steamid}",
                            );
                            guest_data.guest_map.remove(&guestid);
                        }
                        SessionEvent::GameExited => {
                            *guest_data = GuestData::default();
                        }
                    }

                    // Display the user list
                    console::print_update!(
                        "★ Players({}): {}",
                        guest_data.players.len(),
                        guest_data.players_text()
                    );
                    Ok(())
                })();
            }
        });
    }
}

async fn respond_error(
    responder: &mut impl MessageResponder,
    id: String,
    code: ErrorStatus,
) -> Result<()> {
    responder
        .send_response(ClientMessage {
            id,
            cmd: ClientCmd::Error { code },
        })
        .await
}
