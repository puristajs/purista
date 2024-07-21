#!/bin/bash

# Extract the version from package.json
NODE_VERSION=$(node -p "require('./package.json').version")

# Print the extracted version
echo "Version from package.json: $NODE_VERSION"

# Create the content to be written to version.ts
CONTENT="export const puristaVersion = '$NODE_VERSION'"

# Iterate over each subdirectory in the packages directory
for dir in ./packages/*/; do
    # Remove trailing slash
    dir=${dir%*/}

    # Extract the directory name
    dirname=${dir##*/}

    # Print the directory name
    echo "Processing package: $dirname"

    # Write the content to version.ts in the src subdirectory of each package
    echo "$CONTENT" > "./packages/$dirname/src/version.ts"
    
    # Check if jsr.json exists in the current directory
    if [ -f "./packages/$dirname/jsr.json" ]; then
        echo "Updating jsr.json in $dirname"
        
        # Update the version field in jsr.json
        node -e "
        const fs = require('fs');
        const path = './packages/$dirname/jsr.json';
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        data.version = '$NODE_VERSION';
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        "
    else
        echo "jsr.json not found in $dirname"
    fi
done
