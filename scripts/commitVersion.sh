NODE_VERSION=$(node -p -e "require('./package.json').version")
echo $NODE_VERSION

git-cliff --tag v$NODE_VERSION > CHANGELOG.md

CONTENT="export const puristaVersion = '$NODE_VERSION'"

echo $CONTENT > ./packages/amqpbridge/src/version.ts
echo $CONTENT > ./packages/aws-param-config-store/src/version.ts
echo $CONTENT > ./packages/aws-secret-store/src/version.ts
echo $CONTENT > ./packages/azure-secret-store/src/version.ts
echo $CONTENT > ./packages/base-http-bridge/src/version.ts
echo $CONTENT > ./packages/cli/src/version.ts
echo $CONTENT > ./packages/core/src/version.ts
echo $CONTENT > ./packages/dapr-sdk/src/version.ts
echo $CONTENT > ./packages/gcloud-secret-store/src/version.ts
echo $CONTENT > ./packages/httpserver/src/version.ts
echo $CONTENT > ./packages/infisical-secret-store/src/version.ts
echo $CONTENT > ./packages/k8s-sdk/src/version.ts
echo $CONTENT > ./packages/mqttbridge/src/version.ts
echo $CONTENT > ./packages/nats-config-store/src/version.ts
echo $CONTENT > ./packages/nats-state-store/src/version.ts
echo $CONTENT > ./packages/natsbridge/src/version.ts
echo $CONTENT > ./packages/redis-config-store/src/version.ts
echo $CONTENT > ./packages/redis-state-store/src/version.ts



git add .
git commit -am "chore: bump versions to $NODE_VERSION" -S
git tag -a v$NODE_VERSION -m "v$NODE_VERSION"