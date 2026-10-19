//! Installed Steam games, read from the Steam library manifests on disk.

use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
};

use anyhow::{Context as _, Result};

/// Returns the Steam installation directory
pub fn steam_dir() -> Result<PathBuf> {
    #[cfg(target_os = "macos")]
    {
        let home = std::env::var_os("HOME").context("HOME is not set")?;
        Ok(PathBuf::from(home).join("Library/Application Support/Steam"))
    }
    #[cfg(target_os = "linux")]
    {
        let home = PathBuf::from(std::env::var_os("HOME").context("HOME is not set")?);
        let candidates = [
            home.join(".steam/steam"),
            home.join(".local/share/Steam"),
            home.join(".var/app/com.valvesoftware.Steam/.local/share/Steam"),
        ];
        candidates
            .into_iter()
            .find(|p| p.join("steamapps").is_dir())
            .context("Steam installation was not found")
    }
    #[cfg(target_os = "windows")]
    {
        use winreg::{enums::HKEY_CURRENT_USER, RegKey};
        let steam_path: String = RegKey::predef(HKEY_CURRENT_USER)
            .open_subkey(r"Software\Valve\Steam")
            .and_then(|key| key.get_value("SteamPath"))
            .context("Steam installation was not found")?;
        Ok(PathBuf::from(steam_path))
    }
}

/// Extracts the value of a key from a VDF text (`"key"  "value"`)
fn vdf_value<'a>(text: &'a str, key: &str) -> Option<&'a str> {
    vdf_values(text, key).next()
}

/// Extracts all values of a key from a VDF text
fn vdf_values<'a>(text: &'a str, key: &str) -> impl Iterator<Item = &'a str> + 'a {
    let needle = format!("\"{key}\"");
    text.lines().filter_map(move |line| {
        let line = line.trim();
        let rest = line.strip_prefix(needle.as_str())?;
        let rest = rest.trim_start();
        let rest = rest.strip_prefix('"')?;
        rest.split('"').next()
    })
}

/// Parses `libraryfolders.vdf` and returns the library paths
pub fn parse_library_folders(text: &str) -> Vec<PathBuf> {
    vdf_values(text, "path")
        .map(|p| PathBuf::from(p.replace("\\\\", "\\")))
        .collect()
}

/// Parses an `appmanifest_*.acf` and returns `(app_id, installdir)`
pub fn parse_app_manifest(text: &str) -> Option<(u32, String)> {
    let app_id = vdf_value(text, "appid")?.parse().ok()?;
    let installdir = vdf_value(text, "installdir")?;
    Some((app_id, installdir.to_string()))
}

/// Installed games with their installation directories
#[derive(Debug, Default, Clone)]
pub struct Library {
    pub install_dirs: HashMap<u32, PathBuf>,
}

impl Library {
    /// Reads every library folder of the Steam installation
    pub fn scan() -> Result<Self> {
        Self::scan_from(&steam_dir()?)
    }

    /// Reads every library folder referenced by the given Steam installation
    pub fn scan_from(steam_dir: &Path) -> Result<Self> {
        let mut folders = vec![steam_dir.to_path_buf()];
        if let Ok(text) = fs::read_to_string(steam_dir.join("steamapps/libraryfolders.vdf")) {
            folders.extend(parse_library_folders(&text));
        }
        folders.dedup();

        let mut install_dirs = HashMap::new();
        for folder in folders {
            let steamapps = folder.join("steamapps");
            let Ok(entries) = fs::read_dir(&steamapps) else {
                continue;
            };
            for entry in entries.flatten() {
                let name = entry.file_name();
                let name = name.to_string_lossy();
                if !name.starts_with("appmanifest_") || !name.ends_with(".acf") {
                    continue;
                }
                let Ok(text) = fs::read_to_string(entry.path()) else {
                    continue;
                };
                if let Some((app_id, installdir)) = parse_app_manifest(&text) {
                    install_dirs.insert(app_id, steamapps.join("common").join(installdir));
                }
            }
        }
        Ok(Self { install_dirs })
    }

    /// Returns the AppID whose installation directory contains the path
    pub fn app_for_path(&self, path: &Path) -> Option<u32> {
        self.install_dirs
            .iter()
            .find(|(_, dir)| path.starts_with(dir))
            .map(|(app_id, _)| *app_id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn library_folders() {
        let text = "\"libraryfolders\"\n{\n\t\"0\"\n\t{\n\t\t\"path\"\t\t\"/home/user/.local/share/Steam\"\n\t\t\"apps\"\n\t\t{\n\t\t\t\"1306180\"\t\t\"0\"\n\t\t}\n\t}\n}";
        assert_eq!(
            parse_library_folders(text),
            vec![PathBuf::from("/home/user/.local/share/Steam")]
        );
        // Windows paths are escaped in VDF
        let win = "\"libraryfolders\"\n{\n\t\"0\"\n\t{\n\t\t\"path\"\t\t\"C:\\\\Program Files (x86)\\\\Steam\"\n\t}\n\t\"1\"\n\t{\n\t\t\"path\"\t\t\"D:\\\\SteamLibrary\"\n\t}\n}";
        assert_eq!(
            parse_library_folders(win),
            vec![
                PathBuf::from(r"C:\Program Files (x86)\Steam"),
                PathBuf::from(r"D:\SteamLibrary")
            ]
        );
    }

    #[test]
    fn app_manifest() {
        let text = "\"AppState\"\n{\n\t\"appid\"\t\t\"1306180\"\n\t\"name\"\t\t\"Retrocycles\"\n\t\"installdir\"\t\t\"Retrocycles\"\n}";
        assert_eq!(
            parse_app_manifest(text),
            Some((1306180, "Retrocycles".to_string()))
        );
        assert_eq!(parse_app_manifest("\"AppState\"\n{\n}"), None);
    }

    #[test]
    fn app_for_path() {
        let mut library = Library::default();
        library.install_dirs.insert(
            1306180,
            PathBuf::from("/steam/steamapps/common/Retrocycles"),
        );
        library.install_dirs.insert(
            2644470,
            PathBuf::from("/steam/steamapps/common/PICO PARK 2"),
        );
        assert_eq!(
            library.app_for_path(Path::new(
                "/steam/steamapps/common/Retrocycles/Retrocycles.app/Contents/MacOS/Retrocycles"
            )),
            Some(1306180)
        );
        assert_eq!(
            library.app_for_path(Path::new("/steam/steamapps/common/Retrocycles2/x")),
            None
        );
        assert_eq!(library.app_for_path(Path::new("/usr/bin/steam")), None);
    }
}
