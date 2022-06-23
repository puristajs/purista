NODE_VERSION=$(node -p -e "require('./package.json').version")
echo $NODE_VERSION

git-cliff --tag v$NODE_VERSION > CHANGELOG.md

git add .
git commit -am "chore: bump versions to $NODE_VERSION"
git tag -a v$NODE_VERSION -m "v$NODE_VERSION"