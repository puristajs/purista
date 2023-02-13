NODE_VERSION=$(node -p -e "require('./package.json').version")
echo $NODE_VERSION

git-cliff --tag v$NODE_VERSION > CHANGELOG.md

CONTENT="export const puristaVersion = '$NODE_VERSION'"

echo $CONTENT > ./packages/amqpbridge/src/version.ts
echo $CONTENT > ./packages/core/src/version.ts
echo $CONTENT > ./packages/cli/src/version.ts
echo $CONTENT > ./packages/httpserver/src/version.ts

git add .
git commit -am "chore: bump versions to $NODE_VERSION"
git tag -a v$NODE_VERSION -m "v$NODE_VERSION"