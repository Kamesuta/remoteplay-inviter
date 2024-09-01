#[doc = "@brief Callback for when a Remote Play invite result is received.\n@param invitee The Steam ID of the invitee.\n@param guestID The guest ID of the invitee.\n@param connectURL The URL to connect to the Remote Play session."]
pub type OnRemoteInvited = ::std::option::Option<
    unsafe extern "C" fn(invitee: u64, guestID: u64, connectURL: *const ::std::os::raw::c_char),
>;

#[doc = "@brief Callback for when a Remote Play session is started.\n@param invitee The Steam ID of the invitee.\n@param guestID The guest ID of the invitee."]
pub type OnRemoteStarted = ::std::option::Option<unsafe extern "C" fn(invitee: u64, guestID: u64)>;

#[doc = "@brief Callback for when a Remote Play session is closed.\n@param invitee The Steam ID of the invitee.\n@param guestID The guest ID of the invitee."]
pub type OnRemoteStopped = ::std::option::Option<unsafe extern "C" fn(invitee: u64, guestID: u64)>;

extern "C" {
    pub fn SteamStuff_Init() -> bool;
    pub fn SteamStuff_Shutdown();
    pub fn SteamStuff_RunCallbacks();
    pub fn SteamStuff_GetRunningGameID() -> u64;
    pub fn SteamStuff_SendInvite(invitee: u64, gameID: u64) -> u64;
    pub fn SteamStuff_CancelInvite(invitee: u64, guestID: u64);
    pub fn SteamStuff_SetOnRemoteInvited(cb: OnRemoteInvited);
    pub fn SteamStuff_SetOnRemoteStarted(cb: OnRemoteStarted);
    pub fn SteamStuff_SetOnRemoteStopped(cb: OnRemoteStopped);
}
