NODE_VERSION=$(node -p -e "require('./package.json').version")
echo $NODE_VERSION

CONTENT="export const puristaVersion = '$NODE_VERSION'"

for dir in ./packages/*/     # list directories in the form "/tmp/dirname/"
do
    dir=${dir%*/}      # remove the trailing "/"
    echo "${dir##*/}"    # print everything after the final "/"
    echo $CONTENT > ./packages/${dir##*/}/src/version.ts
done

git add .
git commit -am "chore: bump versions to $NODE_VERSION" -S
git tag -a v$NODE_VERSION -m "v$NODE_VERSION"