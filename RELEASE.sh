#!/bin/bash

# TODO: validate major|minor|patch...

echo -e "\nRELEASE [$1]\n"

echo -e "1. TESTING\n"
node test/_.mjs;

echo -e "2. BUILDING PROD FILE"
node_modules/.bin/rollup src/genz.mjs --plugin terser --file genz.build.mjs

echo -e "\n2. BUILDING PLAYGROUND\n"
BASE=/genz/ node_modules/.bin/vite build playground --config playground/vite.config.js

echo -e "\n2. DEPLOYING PLAYGROUND TO GITHUB PAGES \n"
git checkout -b temp-deploy
git add playground/dist -f;
git commit -am "temporarily adding playground"
git push origin temp-deploy
git subtree push --prefix playground/dist origin gh-pages --squash
# Reset the head...
rm -rf playground/dist
git checkout main
git branch -D temp-deploy
git status

# echo -e "\n2. BUMPING VERSION & PUSHING TAG\n"
# npm version $1
# git push origin --tags
