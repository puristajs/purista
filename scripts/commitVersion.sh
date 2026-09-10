#!/bin/bash

set -euo pipefail

# Extract the release version from the root manifest.
RELEASE_VERSION=$(node -p "require('./package.json').version")

echo "Version from package.json: $RELEASE_VERSION"

# A package directory is defined by package.json. This deliberately ignores
# stale build directories and other folders matched by packages/*.
for package_manifest in ./packages/*/package.json; do
	[ -f "$package_manifest" ] || continue
	package_dir=${package_manifest%/package.json}
	package_name=${package_dir##*/}

	echo "Processing package: $package_name"
	mkdir -p "$package_dir/src"
	printf '%s\n' '/** PURISTA release version for this package. */' "export const puristaVersion = '$RELEASE_VERSION'" > "$package_dir/src/version.ts"

	jsr_manifest="$package_dir/jsr.json"
	if [ -f "$jsr_manifest" ]; then
		echo "Updating jsr.json in $package_name"
		node -e '
			const fs = require("node:fs")
			const [manifestPath, releaseVersion] = process.argv.slice(1)
			const source = fs.readFileSync(manifestPath, "utf8")
			const current = JSON.parse(source)
			const updated = source.replace(/("version"\s*:\s*)"[^"]+"/, `$1"${releaseVersion}"`)
			if (updated === source && current.version !== releaseVersion) {
				throw new Error(`Missing top-level version in ${manifestPath}`)
			}
			JSON.parse(updated)
			fs.writeFileSync(manifestPath, updated)
		' "$jsr_manifest" "$RELEASE_VERSION"
	fi
done
