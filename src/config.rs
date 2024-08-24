use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::{
    env, fs,
    path::{Path, PathBuf},
};

/// Endpoint configuration
#[derive(Serialize, Deserialize)]
pub struct EndpointConfig {
    /// Endpoint URL to connect to
    pub url: String,
}

/// UUID configuration
#[derive(Serialize, Deserialize)]
pub struct Config {
    /// UUID
    pub uuid: String,
}

/// Get the current executable path
pub fn get_exe_path() -> Result<PathBuf> {
    // If the APPIMAGE environment variable is set, use its path as the current executable path.
    match env::var("APPIMAGE") {
        Ok(appimage_path) => {
            let appimage_path = Path::new(&appimage_path);
            if appimage_path.exists() {
                Ok(appimage_path.to_path_buf())
            } else {
                Err(anyhow::anyhow!(
                    "APPIMAGE path does not exist: {:?}",
                    appimage_path
                ))
            }
        }
        Err(_) => env::current_exe().context("Unable to get current executable path"),
    }
}

/// Read the endpoint configuration
pub fn read_endpoint_config() -> Result<Option<EndpointConfig>> {
    let exe_path = get_exe_path()?;
    let config_path = exe_path.with_extension("endpoint.toml");

    if config_path.exists() {
        let config_content = fs::read_to_string(&config_path)
            .with_context(|| format!("Unable to read endpoint config file: {:?}", &config_path))?;
        let config: EndpointConfig =
            toml::from_str(&config_content).context("Unable to parse endpoint config file")?;
        Ok(Some(config))
    } else {
        Ok(None)
    }
}

/// Read or generate the UUID configuration
pub fn read_or_generate_config<F: Fn() -> Config>(generate_config: F) -> Result<Config> {
    let exe_path = get_exe_path()?;
    let config_path = exe_path.with_extension("config.toml");

    if config_path.exists() {
        let config_content = fs::read_to_string(&config_path)
            .with_context(|| format!("Unable to read UUID config file: {:?}", &config_path))?;
        let config: Config =
            toml::from_str(&config_content).context("Unable to parse UUID config file")?;
        Ok(config)
    } else {
        let config = generate_config();
        let config_content = toml::to_string(&config).context("Unable to serialize config")?;
        fs::write(&config_path, config_content)
            .with_context(|| format!("Unable to write config file: {:?}", &config_path))?;
        Ok(config)
    }
}
