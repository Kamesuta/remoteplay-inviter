use steam_stuff::{SteamStuff_Init, SteamStuff_Shutdown};

fn main() {
    unsafe {
        SteamStuff_Init();
        SteamStuff_Shutdown();
    }
    println!("Hello, world!");
}
