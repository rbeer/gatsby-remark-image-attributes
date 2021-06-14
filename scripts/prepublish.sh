#!/usr/bin/env bash

rm -rf dist/
npm run cov &&
  npm run build && \
  npm run update-css-props && \
  cp ./src/css-props.json ./dist/css-props.json

git add ./src/css-props.json
git commit "Chore: update css-props" 2> /dev/null
exit 0
