pub mod detector;
pub mod game_id;
pub mod helper;
pub mod helper_main;
pub mod protocol;

use std::{sync::Arc, thread, time::Duration};

use anyhow::{anyhow, Context as _, Result};
use tokio::sync::{
    mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender},
    watch, Mutex,
};

pub use game_id::{GameID, GameUID};
use helper::HelperProcess;

/// How often the running game is checked
const POLL_INTERVAL: Duration = Duration::from_secs(1);
/// How long a game change must last before the helper is stopped
const GAME_CHANGE_GRACE: Duration = Duration::from_secs(2);

/// Remote Play session events
#[derive(Debug, Clone)]
pub enum SessionEvent {
    /// A player joined
    Joined { steamid: u64, guestid: u32, rpt: bool },
    /// A player left
    Left { steamid: u64, guestid: u32 },
    /// The game exited, so all sessions are gone
    GameExited,
}

/// Source of the currently running game
pub trait GameDetector {
    fn running_game(&mut self) -> GameID;
}

/// Entry point for everything Steam related
pub struct SteamManager {
    game: watch::Receiver<GameID>,
    helper: Mutex<Option<Arc<HelperProcess>>>,
    session_tx: UnboundedSender<SessionEvent>,
}

impl SteamManager {
    /// Connects to Steam and starts watching the running game.
    /// The detector is created and used on its own thread.
    pub fn start<D, F>(make_detector: F) -> Result<(Arc<Self>, UnboundedReceiver<SessionEvent>)>
    where
        D: GameDetector,
        F: FnOnce() -> Result<D> + Send + 'static,
    {
        let (game_tx, game_rx) = watch::channel(GameID::default());
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
                let game = detector.running_game();
                game_tx.send_if_modified(|current| {
                    let changed = *current != game;
                    *current = game;
                    changed
                });
                if game_tx.is_closed() {
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
            game: game_rx,
            helper: Mutex::new(None),
            session_tx,
        });
        manager.clone().spawn_game_watcher();
        Ok((manager, session_rx))
    }

    /// Stops the helper once its game is no longer running
    fn spawn_game_watcher(self: Arc<Self>) {
        let mut game_rx = self.game.clone();
        tokio::spawn(async move {
            while game_rx.changed().await.is_ok() {
                // Ignore short glitches; stopping the helper ends the game on Steam
                tokio::time::sleep(GAME_CHANGE_GRACE).await;
                let game = *game_rx.borrow_and_update();

                let mut helper = self.helper.lock().await;
                let stale = helper
                    .as_ref()
                    .is_some_and(|h| !game.is_valid_app() || h.app_id != game.app_id);
                if stale {
                    if let Some(old) = helper.take() {
                        old.quit().await;
                    }
                    let _ = self.session_tx.send(SessionEvent::GameExited);
                }
            }
        });
    }

    /// The currently running game
    pub fn running_game(&self) -> GameID {
        *self.game.borrow()
    }

    /// Returns the helper for the app, starting it if needed
    pub async fn ensure_helper(&self, app_id: u32) -> Result<Arc<HelperProcess>> {
        let mut helper = self.helper.lock().await;
        if let Some(h) = helper.as_ref() {
            if h.app_id == app_id && h.is_alive() {
                return Ok(h.clone());
            }
        }
        if let Some(old) = helper.take() {
            if old.is_alive() {
                old.quit().await;
            }
        }

        let new = Arc::new(
            HelperProcess::spawn(app_id, self.session_tx.clone())
                .await
                .context("Failed to start the Steam helper")?,
        );
        *helper = Some(new.clone());
        Ok(new)
    }

    /// Creates a guest invite link and shows the Remote Play Together UI
    pub async fn create_invite_link(&self, app_id: u32) -> Result<String> {
        let helper = self.ensure_helper(app_id).await?;
        let url = helper.request_link().await?;
        // The UI is only a convenience for the host
        let _ = helper.show_ui().await;
        Ok(url)
    }
}
