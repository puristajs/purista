NODE_VERSION=$(node -p -e "require('./package.json').version")
echo $NODE_VERSION