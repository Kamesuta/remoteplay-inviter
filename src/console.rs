use anyhow::{Context as _, Result};
use crossterm::{cursor, terminal, QueueableCommand};
use std::io::{stdout, Write};
use std::sync::{LazyLock, Mutex};

/// Last line
static LAST_LINE: LazyLock<Mutex<String>> = LazyLock::new(|| Mutex::new("".to_string()));

/// Clears the current line
pub fn clear_line() -> Result<()> {
    stdout()
        .queue(terminal::Clear(terminal::ClearType::CurrentLine))
        .context("Failed to update output (clear line)")?;
    Ok(())
}

/// Saves the last line
pub fn save_line(args: std::fmt::Arguments<'_>) -> Result<()> {
    // Save the last line
    let mut data = LAST_LINE
        .lock()
        .map_err(|_| anyhow::anyhow!("Failed to lock last line"))?;
    *data = std::fmt::format(args);
    Ok(())
}

/// Updates the current line
/// <https://stackoverflow.com/a/59890400>
pub fn update_line() -> Result<()> {
    let mut stdout = stdout();
    let data = LAST_LINE
        .lock()
        .map_err(|_| anyhow::anyhow!("Failed to lock last line"))?;
    stdout
        .queue(terminal::Clear(terminal::ClearType::CurrentLine))
        .context("Failed to update output (clear line)")?;
    stdout
        .write_all(data.as_bytes())
        .context("Failed to update output (write)")?;
    stdout
        .queue(cursor::MoveToColumn(0))
        .context("Failed to update output (left feed)")?;
    stdout.flush().context("Failed to update output (flush)")?;
    Ok(())
}

/// println macro
macro_rules! println {
    ($($arg:tt)*) => {{
        $crate::console::clear_line()?;
        std::println!($($arg)*); // Call the original macro
        $crate::console::update_line()?;
    }};
}
pub(crate) use println;

/// eprintln macro
macro_rules! eprintln {
    ($($arg:tt)*) => {{
        $crate::console::clear_line()?;
        std::eprintln!($($arg)*); // Call the original macro
        $crate::console::update_line()?;
    }};
}
pub(crate) use eprintln;

/// printdoc macro
macro_rules! printdoc {
    ($($arg:tt)*) => {{
        $crate::console::clear_line()?;
        indoc::printdoc!($($arg)*); // Call the original macro
        $crate::console::update_line()?;
    }};
}
pub(crate) use printdoc;

/// print_update macro
macro_rules! print_update {
    ($($arg:tt)*) => {{
        $crate::console::save_line(format_args!($($arg)*))?;
        $crate::console::update_line()?;
    }};
}
pub(crate) use print_update;
