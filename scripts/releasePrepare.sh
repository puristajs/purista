#!/bin/bash

set -euo pipefail

if [ "${1:-}" = "" ]; then
	echo "Usage: ./scripts/releasePrepare.sh <patch|minor|major>"
	exit 1
fi

BUMP_TYPE="$1"

if [[ "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
	echo "Invalid release type: $BUMP_TYPE"
	echo "Expected one of: patch, minor, major"
	exit 1
fi

echo "Building core package first"
npm run build -w packages/core

echo "Running full workspace build"
npm run build --workspaces --if-present
npm run lint:fix

echo "Running unit tests"
npm run test:unit

echo "Bumping root version ($BUMP_TYPE)"
npm version "$BUMP_TYPE" --no-git-tag-version

echo "Bumping workspace versions ($BUMP_TYPE)"
npm version "$BUMP_TYPE" --no-git-tag-version --workspaces

echo "Updating package version.ts files and jsr.json versions"
./scripts/commitVersion.sh

echo "Rebuilding to pick up updated version.ts"
npm run build -w packages/core
npm run build --workspaces --if-present
npm run lint:fix

echo "Updating changelog and documentation (including API docs)"
npm run build:doc
