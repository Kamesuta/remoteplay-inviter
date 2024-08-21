mod game_id;
mod native;
mod steam_stuff;

pub use game_id::{GameID, GameUID};
pub use steam_stuff::SteamStuff;

// extern crate to link C++ library
extern crate link_cplusplus;
