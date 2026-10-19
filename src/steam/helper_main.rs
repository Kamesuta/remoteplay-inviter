//! Entry point of the per-game helper process (`--steam-helper <appid>`).
//!
//! The Steamworks API binds a process to a single AppID, so the main process starts one
//! helper per running game. Steam treats the game as closed as soon as the helper exits,
//! so the helper keeps running until its game exits, even if the main process is gone.

use std::{
    collections::HashMap,
    ffi::CStr,
    io::{BufRead, Write},
    sync::mpsc::{self, TryRecvError},
    thread,
    time::{Duration, Instant},
};

use anyhow::{bail, Result};
use steamworks_sys as sys;

use super::{
    detector::ProcessDetector,
    protocol::{parse_line, to_line, HelperEvent, HelperRequest},
    GameDetector,
};

/// How often the helper checks that its game is still running
const GAME_CHECK_INTERVAL: Duration = Duration::from_secs(1);
/// How long the game must be gone before the helper exits
const GAME_EXIT_GRACE: Duration = Duration::from_secs(2);

/// Command line flag that starts the helper
pub const HELPER_FLAG: &str = "--steam-helper";

/// Returns the AppID if the process was started as a helper
pub fn parse_args() -> Option<u32> {
    let mut args = std::env::args().skip(1);
    if args.next()? != HELPER_FLAG {
        return None;
    }
    args.next()?.parse().ok()
}

fn emit(event: &HelperEvent) {
    let mut out = std::io::stdout().lock();
    let _ = writeln!(out, "{}", to_line(event));
    let _ = out.flush();
}

/// Runs the helper until a quit request arrives or stdin is closed
pub fn run(app_id: u32) -> Result<()> {
    let result = run_inner(app_id);
    if let Err(err) = &result {
        emit(&HelperEvent::Error {
            msg: format!("{err:#}"),
        });
    }
    result
}

fn run_inner(app_id: u32) -> Result<()> {
    // Keep running when the terminal of the main process is closed or interrupted
    #[cfg(unix)]
    // SAFETY: only changes the signal dispositions of this process
    unsafe {
        libc::signal(libc::SIGHUP, libc::SIG_IGN);
        libc::signal(libc::SIGINT, libc::SIG_IGN);
    }

    std::env::set_var("SteamAppId", app_id.to_string());
    std::env::set_var("SteamGameId", app_id.to_string());

    // SAFETY: plain calls into the Steamworks flat API; pointers are checked before use
    let (pipe, remote_play) = unsafe {
        let mut err: sys::SteamErrMsg = [0; 1024];
        let res = sys::SteamAPI_InitFlat(&mut err);
        if res != sys::ESteamAPIInitResult::k_ESteamAPIInitResult_OK {
            let msg = CStr::from_ptr(err.as_ptr()).to_string_lossy();
            bail!("Failed to initialize the Steam API ({res:?}): {msg}");
        }
        sys::SteamAPI_ManualDispatch_Init();
        let remote_play = sys::SteamAPI_SteamRemotePlay_v004();
        if remote_play.is_null() {
            sys::SteamAPI_Shutdown();
            bail!("ISteamRemotePlay is not available");
        }
        (sys::SteamAPI_GetHSteamPipe(), remote_play)
    };

    // Read requests on a separate thread; a closed stdin means the main process is gone
    let (req_tx, req_rx) = mpsc::channel::<HelperRequest>();
    thread::spawn(move || {
        for line in std::io::stdin().lock().lines() {
            let Ok(line) = line else { break };
            if let Some(req) = parse_line::<HelperRequest>(&line) {
                if req_tx.send(req).is_err() {
                    return;
                }
            }
        }
    });

    // Watches the game so that the helper can exit on its own
    let mut detector = ProcessDetector::new().ok();
    let mut last_check = Instant::now();
    let mut last_seen = Instant::now();
    let mut main_process_gone = false;

    emit(&HelperEvent::Ready);

    // Players by session ID (the session details are gone once it disconnects)
    let mut sessions: HashMap<u32, (u64, u32)> = HashMap::new();
    // Number of guest invites created so far (guest IDs are assigned in this order)
    let mut invites_created: u32 = 0;
    loop {
        // Handle requests
        loop {
            let req = match req_rx.try_recv() {
                Ok(req) => req,
                Err(TryRecvError::Empty) => break,
                Err(TryRecvError::Disconnected) => {
                    main_process_gone = true;
                    break;
                }
            };
            match req {
                HelperRequest::Link => {
                    // SAFETY: remote_play is a valid interface pointer
                    // An empty Steam ID creates a guest invite; the URL arrives as a callback
                    let sent = unsafe {
                        sys::SteamAPI_ISteamRemotePlay_BSendRemotePlayTogetherInvite(remote_play, 0)
                    };
                    if !sent {
                        emit(&HelperEvent::LinkFailed);
                    }
                }
                HelperRequest::Quit => {
                    // SAFETY: the API was initialized above
                    unsafe { sys::SteamAPI_Shutdown() };
                    return Ok(());
                }
            }
        }

        // SAFETY: pipe and remote_play stay valid until SteamAPI_Shutdown
        unsafe { dispatch_callbacks(pipe, remote_play, &mut sessions, &mut invites_created) };

        // Exit once the game has exited
        if last_check.elapsed() >= GAME_CHECK_INTERVAL {
            last_check = Instant::now();
            let game_exited = match detector.as_mut() {
                Some(detector) => {
                    if detector.running_games().contains(&app_id) {
                        last_seen = Instant::now();
                    }
                    last_seen.elapsed() >= GAME_EXIT_GRACE
                }
                // Without a detector, rely on the main process
                None => main_process_gone,
            };
            if game_exited {
                // SAFETY: the API was initialized above
                unsafe { sys::SteamAPI_Shutdown() };
                return Ok(());
            }
        }

        thread::sleep(Duration::from_millis(100));
    }
}

/// Reads all pending callbacks and forwards the relevant ones
unsafe fn dispatch_callbacks(
    pipe: sys::HSteamPipe,
    remote_play: *mut sys::ISteamRemotePlay,
    sessions: &mut HashMap<u32, (u64, u32)>,
    invites_created: &mut u32,
) {
    const GUEST_INVITE: i32 = sys::SteamRemotePlayTogetherGuestInvite_t_k_iCallback as i32;
    const CONNECTED: i32 = sys::SteamRemotePlaySessionConnected_t_k_iCallback as i32;
    const DISCONNECTED: i32 = sys::SteamRemotePlaySessionDisconnected_t_k_iCallback as i32;

    sys::SteamAPI_ManualDispatch_RunFrame(pipe);
    let mut msg: sys::CallbackMsg_t = std::mem::zeroed();
    while sys::SteamAPI_ManualDispatch_GetNextCallback(pipe, &mut msg) {
        // CallbackMsg_t may be packed, so copy the fields before use
        let callback = msg.m_iCallback;
        let param = msg.m_pubParam;
        match callback {
            GUEST_INVITE => {
                let data = param
                    .cast::<sys::SteamRemotePlayTogetherGuestInvite_t>()
                    .read_unaligned();
                let url = CStr::from_ptr(data.m_szConnectURL.as_ptr())
                    .to_string_lossy()
                    .into_owned();
                *invites_created += 1;
                emit(&HelperEvent::Link {
                    url,
                    guestid: *invites_created,
                });
            }
            CONNECTED => {
                let data = param
                    .cast::<sys::SteamRemotePlaySessionConnected_t>()
                    .read_unaligned();
                let id = data.m_unSessionID;
                let steamid = sys::SteamAPI_ISteamRemotePlay_GetSessionSteamID(remote_play, id);
                let guestid = sys::SteamAPI_ISteamRemotePlay_GetSessionGuestID(remote_play, id);
                let rpt =
                    sys::SteamAPI_ISteamRemotePlay_BSessionRemotePlayTogether(remote_play, id);
                sessions.insert(id, (steamid, guestid));
                emit(&HelperEvent::Joined {
                    steamid,
                    guestid,
                    rpt,
                });
            }
            DISCONNECTED => {
                let data = param
                    .cast::<sys::SteamRemotePlaySessionDisconnected_t>()
                    .read_unaligned();
                let (steamid, guestid) = sessions.remove(&data.m_unSessionID).unwrap_or((0, 0));
                emit(&HelperEvent::Left { steamid, guestid });
            }
            _ => {}
        }
        sys::SteamAPI_ManualDispatch_FreeLastCallback(pipe);
    }
}
