use anyhow::{Context, Result};
use clipboard::{ClipboardContext, ClipboardProvider};
use futures::SinkExt;
use std::{
    collections::{BTreeSet, HashMap},
    sync::Arc,
    time::Duration,
};
use steam_stuff::{GameID, GameUID};
use tokio::{
    sync::{
        mpsc::{channel, Receiver, Sender},
        Mutex,
    },
    task,
    time::interval,
};
use tokio_tungstenite::tungstenite::{protocol::Message, Error as WsError};

use crate::SteamStuff;
use crate::{
    console,
    models::{ClientCmd, ClientMessage, ErrorStatus, ServerCmd, ServerMessage},
};

pub struct GuestData {
    pub guest_map: HashMap<u64, String>,
    pub user_set: BTreeSet<u64>,
}

pub struct Handler {
    steam: Arc<Mutex<SteamStuff>>,
    invite_tx: Sender<(u64, String)>,
    invite_rx: Receiver<(u64, String)>,
    guest_data: Arc<Mutex<GuestData>>,
}

impl Handler {
    pub fn new(steam: Arc<Mutex<SteamStuff>>) -> Self {
        let (invite_tx, invite_rx) = channel::<(u64, String)>(32);
        Self {
            steam,
            invite_tx,
            invite_rx,
            guest_data: Arc::new(Mutex::new(GuestData {
                guest_map: HashMap::<u64, String>::new(),
                user_set: BTreeSet::<u64>::new(),
            })),
        }
    }

    /**
     * Handles server messages
     * @return Whether to exit (true: exit)
     */
    pub async fn handle_server_message(
        &mut self,
        msg: ServerMessage,
        write: &mut (impl SinkExt<Message, Error = WsError> + Unpin),
    ) -> Result<bool> {
        // Branch based on command type
        let res = match msg.cmd {
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

                return Ok(false);
            }
            ServerCmd::GameId => 'cmd: {
                let game_id = self.steam.lock().await.get_running_game_id();

                if !game_id.is_valid_app() {
                    // If the game is not running
                    // Create the response data
                    break 'cmd ClientMessage {
                        id: msg.id,
                        cmd: ClientCmd::Error {
                            code: ErrorStatus::InvalidApp,
                        },
                    };
                }

                let app_id = game_id.app_id;
                let game_uid: GameUID = game_id.into();

                if !self.steam.lock().await.can_remote_play_together(game_uid) {
                    // If the game is not supported for Remote Play Together
                    // Create the response data
                    break 'cmd ClientMessage {
                        id: msg.id,
                        cmd: ClientCmd::Error {
                            code: ErrorStatus::UnsupportedApp,
                        },
                    };
                }

                // Log the output
                let claimer = msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
                console::println!(
                    "-> Create Panel       : claimer={claimer}, game_id={0}",
                    app_id
                );

                // Create the response data
                ClientMessage {
                    id: msg.id,
                    cmd: ClientCmd::GameId { game: app_id },
                }
            }
            ServerCmd::Link { game } => {
                // Get the game ID
                let game_uid: GameUID = GameID::new(game, 0, 0).into();

                // Create an invite link
                let recv = self.invite_rx.recv();
                self.steam.lock().await.send_invite(0, game_uid);
                let (guest_id, connect_url) = recv.await.unwrap();

                // Associate the Discord user with guest_id
                if let Some(user) = &msg.user {
                    self.guest_data
                        .lock()
                        .await
                        .guest_map
                        .insert(guest_id, user.name.clone());
                }

                // Log the output
                let claimer = msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
                console::println!(
                    "-> Create Invite Link : claimer={claimer}, guest_id={guest_id}, game_id={game}, invite_url={connect_url}", 
                );

                // Create the response data
                ClientMessage {
                    id: msg.id,
                    cmd: ClientCmd::Link { url: connect_url },
                }
            }
            ServerCmd::Exit => {
                // Exit the application
                return Ok(true);
            }
            ServerCmd::Invalid => {
                // Create the response data
                ClientMessage {
                    id: msg.id,
                    cmd: ClientCmd::Error {
                        code: ErrorStatus::InvalidCmd,
                    },
                }
            }
        };

        // Convert the response data to JSON
        let res_str = serde_json::to_string(&res)
            .context("Failed to serialize JSON message for the server")?;
        // Send the response data
        write
            .send(Message::Text(res_str))
            .await
            .context("Failed to send message to the server")?;

        Ok(false)
    }

    // Set up SteamStuff callbacks
    pub async fn setup_steam_callbacks(&self) {
        // Register callbacks
        let steam = self.steam.lock().await;
        let guest_data = self.guest_data.clone();
        steam.set_on_remote_started(move |invitee, guest_id| {
            let guest_data = guest_data.clone();
            tokio::spawn(async move {
                let mut guest_data = guest_data.lock().await;
                guest_data.user_set.insert(guest_id);
                let user_name = guest_data.guest_map.get(&guest_id).map_or_else(|| "?", |s| s);
                let _: Result<()> = try {
                    // Log the output
                    console::println!(
                        "-> Player Joined        : claimer={user_name}, guest_id={guest_id}, steam_id={invitee}",
                    );

                    // Display the user list
                    let users_text = guest_data
                        .user_set
                        .iter()
                        .map(|id| format!("[{}]{}", id, guest_data.guest_map.get(&id).map_or_else(|| "?", |s| s)))
                        .collect::<Vec<String>>()
                        .join(", ");
                    console::print_update!("★ Players({}): {users_text}", guest_data.user_set.len());
                };
            });
        });
        let guest_data = self.guest_data.clone();
        steam.set_on_remote_stopped(move |invitee, guest_id| {
            let guest_data = guest_data.clone();
            tokio::spawn(async move {
                let mut guest_data = guest_data.lock().await;
                guest_data.user_set.remove(&guest_id);
                let user_name = guest_data.guest_map.get(&guest_id).map_or_else(|| "?", |s| s);
                let _: Result<()> = try {
                    // Log the output
                    console::println!(
                        "-> Player Left          : claimer={user_name}, guest_id={guest_id}, steam_id={invitee}",
                    );

                    // Display the user list
                    let users_text = guest_data
                        .user_set
                        .iter()
                        .map(|id| format!("[{}]{}", id, guest_data.guest_map.get(&id).map_or_else(|| "?", |s| s)))
                        .collect::<Vec<String>>()
                        .join(", ");
                    console::print_update!("★ Players({}): {users_text}", guest_data.user_set.len());
                };
            });
        });
        let invite_tx = self.invite_tx.clone();
        steam.set_on_remote_invited(move |_invitee, guest_id, connect_url| {
            // Send the invite link
            let invite_tx = invite_tx.clone();
            let connect_url = String::from(connect_url);
            tokio::spawn(async move {
                invite_tx.send((guest_id, connect_url)).await.unwrap();
            });
        });
    }

    // Start a task to periodically call SteamStuff_RunCallbacks
    pub fn run_steam_callbacks(&self) {
        let steam_clone = self.steam.clone();
        task::spawn(async move {
            let mut interval = interval(Duration::from_millis(200));
            loop {
                interval.tick().await;
                steam_clone.lock().await.run_callbacks();
            }
        });
    }
}
