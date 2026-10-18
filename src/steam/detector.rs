//! Detection of the currently running game by watching the game processes.
//!
//! Steam itself keeps a game "running" while the helper process is alive,
//! so the actual game processes are checked instead.

use std::{
    path::Path,
    time::{Duration, Instant},
};

use anyhow::Result;
use sysinfo::{Pid, ProcessRefreshKind, ProcessesToUpdate, System, UpdateKind};

use super::{library::Library, GameDetector, GameID};

/// How often the list of installed games is re-read
const LIBRARY_RESCAN_INTERVAL: Duration = Duration::from_secs(30);

pub struct ProcessDetector {
    system: System,
    library: Library,
    last_scan: Instant,
    self_pid: Pid,
    current: GameID,
}

impl ProcessDetector {
    pub fn new() -> Result<Self> {
        Ok(Self {
            system: System::new(),
            library: Library::scan()?,
            last_scan: Instant::now(),
            self_pid: Pid::from_u32(std::process::id()),
            current: GameID::default(),
        })
    }

    /// Returns the AppID of the game the process belongs to
    fn app_of_process(&self, process: &sysinfo::Process) -> Option<u32> {
        if let Some(app_id) = process.exe().and_then(|exe| self.library.app_for_path(exe)) {
            return Some(app_id);
        }
        // Games started through a launcher (e.g. Proton) carry the path as an argument
        process
            .cmd()
            .iter()
            .find_map(|arg| self.library.app_for_path(Path::new(arg)))
    }
}

impl GameDetector for ProcessDetector {
    fn running_game(&mut self) -> GameID {
        // Pick up newly installed games
        if self.last_scan.elapsed() > LIBRARY_RESCAN_INTERVAL {
            if let Ok(library) = Library::scan() {
                self.library = library;
            }
            self.last_scan = Instant::now();
        }

        self.system.refresh_processes_specifics(
            ProcessesToUpdate::All,
            true,
            ProcessRefreshKind::nothing()
                .with_exe(UpdateKind::OnlyIfNotSet)
                .with_cmd(UpdateKind::OnlyIfNotSet),
        );

        let running: Vec<u32> = self
            .system
            .processes()
            .iter()
            .filter(|(pid, _)| **pid != self.self_pid)
            .filter_map(|(_, process)| self.app_of_process(process))
            .collect();

        // Keep reporting the same game while it is running
        let app_id = if running.contains(&self.current.app_id) {
            self.current.app_id
        } else {
            running.into_iter().min().unwrap_or(0)
        };
        self.current = GameID::new(app_id, 0, 0);
        self.current
    }
}
