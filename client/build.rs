use std::{
    env, fs,
    path::{Path, PathBuf},
    process::Command,
};

fn main() {
    let target_os = env::var("CARGO_CFG_TARGET_OS").unwrap();
    let target = env::var("TARGET").unwrap();

    // Windows resources (icon, version info)
    if target_os == "windows" {
        let mut res = winresource::WindowsResource::new();
        res.set_icon("resources/app.ico");
        res.compile().unwrap();
    }

    // Place the Steamworks runtime library next to the built executable
    let Some((sub_dir, lib_name)) = runtime_library(&target) else {
        return;
    };
    let sdk_dir = steam_sdk_dir(&target)
        .unwrap_or_else(|err| panic!("failed to locate the Steamworks SDK: {err}"));
    let src = sdk_dir
        .join("redistributable_bin")
        .join(sub_dir)
        .join(lib_name);
    println!("cargo:rerun-if-changed={}", src.display());

    // OUT_DIR is <target>/<profile>/build/<crate>-<hash>/out
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    let profile_dir = out_dir.ancestors().nth(3).unwrap().to_path_buf();
    for dir in [profile_dir.clone(), profile_dir.join("deps")] {
        let _ = fs::create_dir_all(&dir);
        fs::copy(&src, dir.join(lib_name))
            .unwrap_or_else(|err| panic!("failed to copy {}: {err}", src.display()));
    }

    // Let the executable find the library in its own directory
    if target_os == "linux" {
        println!("cargo:rustc-link-arg-bins=-Wl,-rpath,$ORIGIN");
    }
}

/// Directory under `redistributable_bin` and file name of the runtime library
/// (same layout as steamworks-sys uses)
fn runtime_library(target: &str) -> Option<(&'static str, &'static str)> {
    if target.contains("windows") {
        if target.contains("i686") {
            Some(("", "steam_api.dll"))
        } else {
            Some(("win64", "steam_api64.dll"))
        }
    } else if target.contains("darwin") {
        Some(("osx", "libsteam_api.dylib"))
    } else if target.contains("linux") {
        if target.contains("i686") {
            Some(("linux32", "libsteam_api.so"))
        } else if target.contains("aarch64") {
            Some(("linuxarm64", "libsteam_api.so"))
        } else {
            Some(("linux64", "libsteam_api.so"))
        }
    } else {
        None
    }
}

/// The Steamworks SDK linked by steamworks-sys:
/// `STEAM_SDK_LOCATION` if set, otherwise the copy bundled with the crate
fn steam_sdk_dir(target: &str) -> Result<PathBuf, String> {
    println!("cargo:rerun-if-env-changed=STEAM_SDK_LOCATION");
    if let Ok(dir) = env::var("STEAM_SDK_LOCATION") {
        return Ok(PathBuf::from(dir));
    }

    let manifest = Path::new(&env::var("CARGO_MANIFEST_DIR").unwrap()).join("Cargo.toml");
    let output = Command::new(env::var("CARGO").unwrap())
        .args(["metadata", "--format-version", "1", "--offline"])
        // Only the packages for this target are downloaded
        .args(["--filter-platform", target])
        .arg("--manifest-path")
        .arg(&manifest)
        .output()
        .map_err(|err| format!("cargo metadata: {err}"))?;
    if !output.status.success() {
        return Err(format!(
            "cargo metadata: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    let metadata: serde_json::Value =
        serde_json::from_slice(&output.stdout).map_err(|err| format!("cargo metadata: {err}"))?;
    let manifest_path = metadata["packages"]
        .as_array()
        .into_iter()
        .flatten()
        .find(|package| package["name"] == "steamworks-sys")
        .and_then(|package| package["manifest_path"].as_str())
        .ok_or("steamworks-sys is not a dependency")?;
    Ok(Path::new(manifest_path)
        .parent()
        .unwrap()
        .join("lib")
        .join("steam"))
}
