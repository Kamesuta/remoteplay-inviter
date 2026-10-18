//! Main-process side of the per-game helper process.

use std::{
    process::Stdio,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex as StdMutex,
    },
    time::Duration,
};

use anyhow::{anyhow, bail, Context as _, Result};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    process::{Child, ChildStdin, Command},
    sync::{mpsc::UnboundedSender, oneshot, Mutex},
    time::timeout,
};

use super::{
    helper_main::HELPER_FLAG,
    protocol::{parse_line, to_line, HelperEvent, HelperRequest},
    SessionEvent,
};

/// How long to wait for the helper to initialize the Steam API
const READY_TIMEOUT: Duration = Duration::from_secs(10);
/// How long to wait for an invite link
const LINK_TIMEOUT: Duration = Duration::from_secs(15);
/// How long to wait for the helper to exit after a quit request
const QUIT_TIMEOUT: Duration = Duration::from_secs(3);

type PendingLink = Arc<StdMutex<Option<oneshot::Sender<Result<String>>>>>;

/// A running helper process bound to one AppID
pub struct HelperProcess {
    pub app_id: u32,
    stdin: Mutex<ChildStdin>,
    child: Mutex<Child>,
    pending_link: PendingLink,
    alive: Arc<AtomicBool>,
}

impl HelperProcess {
    /// Starts a helper for the given AppID and waits until it is ready
    pub async fn spawn(app_id: u32, session_tx: UnboundedSender<SessionEvent>) -> Result<Self> {
        // Use the executable itself (not the AppImage, which would open a terminal)
        let exe = std::env::current_exe().context("Failed to get the executable path")?;
        let mut command = Command::new(exe);
        command
            .arg(HELPER_FLAG)
            .arg(app_id.to_string())
            .env("SteamAppId", app_id.to_string())
            .env("SteamGameId", app_id.to_string())
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .kill_on_drop(true);
        #[cfg(windows)]
        {
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            command.creation_flags(CREATE_NO_WINDOW);
        }
        let mut child = command.spawn().context("Failed to start the Steam helper")?;
        let stdin = child.stdin.take().context("Helper stdin is not available")?;
        let stdout = child.stdout.take().context("Helper stdout is not available")?;

        let pending_link: PendingLink = Arc::default();
        let alive = Arc::new(AtomicBool::new(true));
        let (ready_tx, ready_rx) = oneshot::channel::<Result<()>>();

        // Read events from the helper
        {
            let pending_link = pending_link.clone();
            let alive = alive.clone();
            tokio::spawn(async move {
                let mut ready_tx = Some(ready_tx);
                let mut lines = BufReader::new(stdout).lines();
                while let Ok(Some(line)) = lines.next_line().await {
                    let Some(event) = parse_line::<HelperEvent>(&line) else {
                        continue;
                    };
                    match event {
                        HelperEvent::Ready => {
                            if let Some(tx) = ready_tx.take() {
                                let _ = tx.send(Ok(()));
                            }
                        }
                        HelperEvent::Link { url } => resolve(&pending_link, Ok(url)),
                        HelperEvent::LinkFailed => resolve(
                            &pending_link,
                            Err(anyhow!("Steam refused to create the invite")),
                        ),
                        HelperEvent::Joined {
                            steamid,
                            guestid,
                            rpt,
                        } => {
                            let _ = session_tx.send(SessionEvent::Joined {
                                steamid,
                                guestid,
                                rpt,
                            });
                        }
                        HelperEvent::Left { steamid, guestid } => {
                            let _ = session_tx.send(SessionEvent::Left { steamid, guestid });
                        }
                        HelperEvent::Error { msg } => match ready_tx.take() {
                            Some(tx) => {
                                let _ = tx.send(Err(anyhow!(msg)));
                            }
                            None => resolve(&pending_link, Err(anyhow!(msg))),
                        },
                    }
                }

                // The helper exited
                alive.store(false, Ordering::SeqCst);
                if let Some(tx) = ready_tx.take() {
                    let _ = tx.send(Err(anyhow!("The Steam helper exited unexpectedly")));
                }
                resolve(
                    &pending_link,
                    Err(anyhow!("The Steam helper exited unexpectedly")),
                );
            });
        }

        let helper = Self {
            app_id,
            stdin: Mutex::new(stdin),
            child: Mutex::new(child),
            pending_link,
            alive,
        };

        match timeout(READY_TIMEOUT, ready_rx).await {
            Ok(Ok(Ok(()))) => Ok(helper),
            Ok(Ok(Err(err))) => {
                helper.kill().await;
                Err(err)
            }
            Ok(Err(_)) | Err(_) => {
                helper.kill().await;
                bail!("The Steam helper did not start in time")
            }
        }
    }

    /// Whether the helper process is still running
    pub fn is_alive(&self) -> bool {
        self.alive.load(Ordering::SeqCst)
    }

    async fn send(&self, req: HelperRequest) -> Result<()> {
        let mut stdin = self.stdin.lock().await;
        stdin
            .write_all(format!("{}\n", to_line(&req)).as_bytes())
            .await
            .context("Failed to send a request to the Steam helper")?;
        stdin
            .flush()
            .await
            .context("Failed to send a request to the Steam helper")?;
        Ok(())
    }

    /// Creates a guest invite link
    pub async fn request_link(&self) -> Result<String> {
        let (tx, rx) = oneshot::channel();
        {
            let mut pending = self.pending_link.lock().unwrap();
            if pending.is_some() {
                bail!("Another invite link is being created");
            }
            *pending = Some(tx);
        }

        if let Err(err) = self.send(HelperRequest::Link).await {
            self.pending_link.lock().unwrap().take();
            return Err(err);
        }

        match timeout(LINK_TIMEOUT, rx).await {
            Ok(Ok(result)) => result,
            Ok(Err(_)) => bail!("The Steam helper exited unexpectedly"),
            Err(_) => {
                self.pending_link.lock().unwrap().take();
                bail!("Timed out waiting for the invite link")
            }
        }
    }

    /// Shows the Remote Play Together UI
    pub async fn show_ui(&self) -> Result<()> {
        self.send(HelperRequest::ShowUi).await
    }

    /// Asks the helper to exit, killing it if it does not exit in time.
    /// Only call this after the game has exited: Steam treats the game as closed
    /// as soon as the helper exits.
    pub async fn quit(&self) {
        let _ = self.send(HelperRequest::Quit).await;
        let mut child = self.child.lock().await;
        if timeout(QUIT_TIMEOUT, child.wait()).await.is_err() {
            let _ = child.kill().await;
        }
    }

    async fn kill(&self) {
        let _ = self.child.lock().await.kill().await;
    }
}

fn resolve(pending: &PendingLink, result: Result<String>) {
    if let Some(tx) = pending.lock().unwrap().take() {
        let _ = tx.send(result);
    }
}
