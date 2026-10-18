//! Detection of the currently running game.
//!
//! Temporary: this uses the existing steam-stuff connection until its replacement is decided.

use anyhow::Result;
use steam_stuff::SteamStuff;

use super::{GameDetector, GameID, GameUID};

pub struct SteamStuffDetector(SteamStuff);

impl SteamStuffDetector {
    pub fn new() -> Result<Self> {
        Ok(Self(SteamStuff::new()?))
    }
}

impl GameDetector for SteamStuffDetector {
    fn running_game(&mut self) -> GameID {
        self.0.run_callbacks();
        let uid: GameUID = self.0.get_running_game_id().into();
        GameID::from(uid)
    }
}
