#!/bin/bash

# Check if it is being executed in an existing terminal window
if [[ -t 0 ]]; then
  # If executed directly from the terminal
  exec "$APPDIR/remoteplay-inviter" "$@"
else
  # If executed by double-clicking or similar
  exec "$APPDIR/i3-sensible-terminal.sh" -e bash -c "'$APPIMAGE' $@"
fi
