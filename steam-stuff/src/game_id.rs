pub type GameUID = u64;

#[allow(non_camel_case_types, non_snake_case)]
#[repr(C)]
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
        self.game_type == 0 && self.app_id != 0
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

impl Into<GameUID> for GameID {
    fn into(self) -> GameUID {
        (self.app_id as u64) | ((self.game_type as u64) << 24) | ((self.mod_id as u64) << 32)
    }
}
