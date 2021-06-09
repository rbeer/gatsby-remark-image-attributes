#!/usr/bin/env bash

rm -rf dist/
yarn build && \
  yarn update-css-props && \
  cp ./src/css-props.json ./dist/css-props.json

git add ./src/css-props.json
git commit "Chore: update css-props" 2> /dev/null
exit 0
