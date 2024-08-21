#!/bin/bash

# Run the application and capture the output
output=$(./AppRun 2>&1)

# Check if the return value is 1 and the output contains "by Kamesuta"
if [[ $? == 1 && "$output" =~ "by Kamesuta" ]]; then
    exit 0
else
    echo "Unexpected output: $output"
    exit 1
fi
