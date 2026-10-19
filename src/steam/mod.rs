pub mod detector;
pub mod game_id;
pub mod helper;
pub mod helper_main;
pub mod library;
pub mod protocol;

use std::{collections::HashMap, sync::Arc, thread, time::Duration};

use anyhow::{anyhow, Context as _, Result};
use tokio::sync::{
    mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender},
    watch, Mutex,
};

pub use game_id::GameID;
use helper::HelperProcess;
pub use helper::InviteLink;

/// How often the running games are checked
const POLL_INTERVAL: Duration = Duration::from_secs(1);
/// How long a game must be gone before its helper is stopped
const GAME_CHANGE_GRACE: Duration = Duration::from_secs(2);

/// Remote Play session events
#[derive(Debug, Clone)]
pub enum SessionEvent {
    /// A player joined
    Joined {
        app_id: u32,
        steamid: u64,
        guestid: u32,
    },
    /// A player left
    Left {
        app_id: u32,
        steamid: u64,
        guestid: u32,
    },
    /// The game exited, so all of its sessions are gone
    GameExited { app_id: u32 },
}

/// Source of the currently running games
pub trait GameDetector {
    /// AppIDs of all running Steam games
    fn running_games(&mut self) -> Vec<u32>;
}

/// Running Steam games
#[derive(Debug, Clone, Default, PartialEq, Eq)]
struct RunningGames {
    /// AppIDs of all running games
    apps: Vec<u32>,
    /// The game reported when no game is specified (0 if none)
    primary: u32,
}

/// Picks the game to report when no game is specified:
/// keeps the previous one while it is running, otherwise the lowest AppID
fn pick_primary(previous: u32, running: &[u32]) -> u32 {
    if running.contains(&previous) {
        previous
    } else {
        running.iter().copied().min().unwrap_or(0)
    }
}

/// Entry point for everything Steam related
pub struct SteamManager {
    games: watch::Receiver<RunningGames>,
    helpers: Mutex<HashMap<u32, Arc<HelperProcess>>>,
    session_tx: UnboundedSender<SessionEvent>,
}

impl SteamManager {
    /// Connects to Steam and starts watching the running games.
    /// The detector is created and used on its own thread.
    pub fn start<D, F>(make_detector: F) -> Result<(Arc<Self>, UnboundedReceiver<SessionEvent>)>
    where
        D: GameDetector,
        F: FnOnce() -> Result<D> + Send + 'static,
    {
        let (games_tx, games_rx) = watch::channel(RunningGames::default());
        let (init_tx, init_rx) = std::sync::mpsc::channel::<Result<()>>();

        thread::spawn(move || {
            let mut detector = match make_detector() {
                Ok(detector) => {
                    let _ = init_tx.send(Ok(()));
                    detector
                }
                Err(err) => {
                    let _ = init_tx.send(Err(err));
                    return;
                }
            };
            loop {
                let apps = detector.running_games();
                games_tx.send_if_modified(|current| {
                    let next = RunningGames {
                        primary: pick_primary(current.primary, &apps),
                        apps,
                    };
                    let changed = *current != next;
                    *current = next;
                    changed
                });
                if games_tx.is_closed() {
                    return;
                }
                thread::sleep(POLL_INTERVAL);
            }
        });

        init_rx
            .recv()
            .map_err(|_| anyhow!("The Steam watcher stopped unexpectedly"))??;

        let (session_tx, session_rx) = unbounded_channel();
        let manager = Arc::new(Self {
            games: games_rx,
            helpers: Mutex::new(HashMap::new()),
            session_tx,
        });
        manager.clone().spawn_game_watcher();
        Ok((manager, session_rx))
    }

    /// Stops each helper once its game is no longer running
    fn spawn_game_watcher(self: Arc<Self>) {
        let mut games_rx = self.games.clone();
        tokio::spawn(async move {
            while games_rx.changed().await.is_ok() {
                // Ignore short glitches; stopping a helper ends its game on Steam
                tokio::time::sleep(GAME_CHANGE_GRACE).await;
                let running = games_rx.borrow_and_update().apps.clone();

                let mut helpers = self.helpers.lock().await;
                let exited: Vec<u32> = helpers
                    .keys()
                    .copied()
                    .filter(|app_id| !running.contains(app_id))
                    .collect();
                for app_id in exited {
                    if let Some(helper) = helpers.remove(&app_id) {
                        helper.quit().await;
                    }
                    let _ = self.session_tx.send(SessionEvent::GameExited { app_id });
                }
            }
        });
    }

    /// The game reported when no game is specified
    pub fn running_game(&self) -> GameID {
        GameID::new(self.games.borrow().primary, 0, 0)
    }

    /// Whether the game is a running Steam app
    pub fn is_running(&self, app_id: u32) -> bool {
        GameID::new(app_id, 0, 0).is_valid_app() && self.games.borrow().apps.contains(&app_id)
    }

    /// Returns the helper for the app, starting it if needed.
    /// Helpers of other games are left untouched.
    pub async fn ensure_helper(&self, app_id: u32) -> Result<Arc<HelperProcess>> {
        let mut helpers = self.helpers.lock().await;
        if let Some(h) = helpers.get(&app_id) {
            if h.is_alive() {
                return Ok(h.clone());
            }
        }

        let new = Arc::new(
            HelperProcess::spawn(app_id, self.session_tx.clone())
                .await
                .context("Failed to start the Steam helper")?,
        );
        helpers.insert(app_id, new.clone());
        Ok(new)
    }

    /// Creates a guest invite link for the game
    pub async fn create_invite_link(&self, app_id: u32) -> Result<InviteLink> {
        let helper = self.ensure_helper(app_id).await?;
        helper.request_link().await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn primary_game() {
        assert_eq!(pick_primary(0, &[]), 0);
        assert_eq!(pick_primary(0, &[1380430, 1306180]), 1306180);
        // Keeps the previous game while it is running
        assert_eq!(pick_primary(1380430, &[1306180, 1380430]), 1380430);
        // Falls back when the previous game exited
        assert_eq!(pick_primary(1380430, &[1306180]), 1306180);
        assert_eq!(pick_primary(1306180, &[]), 0);
    }
}
