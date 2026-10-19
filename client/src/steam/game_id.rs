pub type GameUID = u64;

/// AppID used by non-Steam shortcuts (Spacewar)
const NON_STEAM_APP_ID: u32 = 480;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct GameID {
    pub app_id: u32,
    pub game_type: u8,
    pub mod_id: u32,
}

impl GameID {
    pub fn new(app_id: u32, game_type: u8, mod_id: u32) -> Self {
        Self {
            app_id: app_id & 0xFFFFFF, // 24 bits
            game_type,                 // 8 bits
            mod_id,                    // 32 bits
        }
    }

    pub fn is_valid_app(&self) -> bool {
        // The game_type is 0 for AppID
        // The app_id is 0 for invalid
        // Non-Steam games are not supported
        self.game_type == 0 && self.app_id != 0 && self.app_id != NON_STEAM_APP_ID
    }
}

impl From<GameUID> for GameID {
    fn from(value: GameUID) -> GameID {
        let app_id = (value & 0xFFFFFF) as u32;
        let game_type = ((value >> 24) & 0xFF) as u8;
        let mod_id = (value >> 32) as u32;
        Self::new(app_id, game_type, mod_id)
    }
}

impl From<GameID> for GameUID {
    fn from(value: GameID) -> GameUID {
        (value.app_id as u64) | ((value.game_type as u64) << 24) | ((value.mod_id as u64) << 32)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trip() {
        let id = GameID::new(1306180, 0, 0);
        let uid: GameUID = id.into();
        assert_eq!(uid, 1306180);
        assert_eq!(GameID::from(uid), id);

        let shortcut: GameUID = 0x8000_1234_0200_0000;
        let id = GameID::from(shortcut);
        assert_eq!(id.game_type, 2);
        assert_eq!(id.mod_id, 0x8000_1234);
        assert_eq!(GameUID::from(id), shortcut);
    }

    #[test]
    fn valid_app() {
        assert!(GameID::new(1306180, 0, 0).is_valid_app());
        assert!(!GameID::default().is_valid_app());
        assert!(!GameID::new(NON_STEAM_APP_ID, 0, 0).is_valid_app());
        assert!(!GameID::new(1306180, 2, 0).is_valid_app());
    }

    #[test]
    fn app_id_is_truncated_to_24_bits() {
        assert_eq!(GameID::new(0x1FF_FFFF, 0, 0).app_id, 0xFF_FFFF);
    }
}
