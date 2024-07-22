use crate::{native, GameID};
use anyhow::Result;
use std::ffi::CStr;
use std::os::raw::c_char;
use std::sync::{Arc, Mutex};

static ON_REMOTE_INVITED: Mutex<Option<Arc<dyn Fn(u64, u64, &str) + Send + Sync>>> =
    Mutex::new(None);
static ON_REMOTE_STARTED: Mutex<Option<Arc<dyn Fn(u64, u64) + Send + Sync>>> = Mutex::new(None);
static ON_REMOTE_STOPPED: Mutex<Option<Arc<dyn Fn(u64, u64) + Send + Sync>>> = Mutex::new(None);

pub struct SteamStuff {
    _private: (),
}

impl SteamStuff {
    pub fn new() -> Result<Self> {
        if unsafe { native::SteamStuff_Init() } {
            Ok(SteamStuff { _private: () })
        } else {
            Err(anyhow::anyhow!("Failed to initialize SteamStuff"))
        }
    }

    pub fn run_callbacks(&self) {
        unsafe { native::SteamStuff_RunCallbacks() }
    }

    pub fn get_running_game_id(&self) -> GameID {
        unsafe { GameID::from(native::SteamStuff_GetRunningGameID()) }
    }

    pub fn send_invite(&self, invitee: u64, game_id: u64) -> u64 {
        unsafe { native::SteamStuff_SendInvite(invitee, game_id) }
    }

    pub fn cancel_invite(&self, invitee: u64, guest_id: u64) {
        unsafe { native::SteamStuff_CancelInvite(invitee, guest_id) }
    }

    pub fn set_on_remote_invited<F>(&self, callback: F)
    where
        F: Fn(u64, u64, &str) + Send + Sync + 'static,
    {
        let cb = Arc::new(callback);
        let mut guard = ON_REMOTE_INVITED.lock().unwrap();
        *guard = Some(cb.clone());

        unsafe extern "C" fn trampoline(invitee: u64, guest_id: u64, connect_url: *const c_char) {
            let cb = ON_REMOTE_INVITED.lock().unwrap();
            if let Some(cb) = &*cb {
                let c_str = unsafe { CStr::from_ptr(connect_url) };
                let r_str = c_str.to_str().unwrap();
                cb(invitee, guest_id, r_str);
            }
        }

        unsafe { native::SteamStuff_SetOnRemoteInvited(Some(trampoline)) }
    }

    pub fn set_on_remote_started<F>(&self, callback: F)
    where
        F: Fn(u64, u64) + Send + Sync + 'static,
    {
        let cb = Arc::new(callback);
        let mut guard = ON_REMOTE_STARTED.lock().unwrap();
        *guard = Some(cb.clone());

        unsafe extern "C" fn trampoline(invitee: u64, guest_id: u64) {
            let cb = ON_REMOTE_STARTED.lock().unwrap();
            if let Some(cb) = &*cb {
                cb(invitee, guest_id);
            }
        }

        unsafe { native::SteamStuff_SetOnRemoteStarted(Some(trampoline)) }
    }

    pub fn set_on_remote_stopped<F>(&self, callback: F)
    where
        F: Fn(u64, u64) + Send + Sync + 'static,
    {
        let cb = Arc::new(callback);
        let mut guard = ON_REMOTE_STOPPED.lock().unwrap();
        *guard = Some(cb.clone());

        unsafe extern "C" fn trampoline(invitee: u64, guest_id: u64) {
            let cb = ON_REMOTE_STOPPED.lock().unwrap();
            if let Some(cb) = &*cb {
                cb(invitee, guest_id);
            }
        }

        unsafe { native::SteamStuff_SetOnRemoteStopped(Some(trampoline)) }
    }
}

impl Drop for SteamStuff {
    fn drop(&mut self) {
        unsafe { native::SteamStuff_Shutdown() }
    }
}
