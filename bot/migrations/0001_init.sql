-- Links between Discord users and clients
CREATE TABLE UserData (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Discord user ID
  userId TEXT NOT NULL UNIQUE,
  -- Discord user name
  name TEXT NOT NULL,
  -- Discord locale of the user
  locale TEXT NOT NULL DEFAULT 'en',
  -- Client ID
  daemonId TEXT NOT NULL UNIQUE,
  -- Version of the last connected client (for statistics)
  daemonVersion TEXT
);
