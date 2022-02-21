#!/bin/bash

# TODO: validate major|minor|patch...

echo -e "\nRELEASE [$1]\n"

echo -e "1. TESTING\n"
node test/_.mjs;

echo -e "2. BUILDING PROD FILE"
node_modules/.bin/rollup src/genz.mjs --plugin terser --file genz.build.mjs

npm version $1
git push origin --tags
