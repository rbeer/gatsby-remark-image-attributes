#!/usr/bin/env bash

rm -rf dist/
# test/coverage, build, or fail
(npm run cov && npm run build) || exit 1

# update CSS properties, if necessary
ERROR_FILE=.css-update-errors
npm run update-css-props 2> $ERROR_FILE
PROPS_UPDATED=$?
case $PROPS_UPDATED in
  0)
    echo "CSS properties updated; committing changes"
    cp ./src/css-props.json ./dist/css-props.json
    git add ./src/css-props.json ./.css-props-updated
    git commit -m "Chore: update css-props"
    ;;
  2)
    exit 0
    ;;
  *)
    echo "Error while updating; see $ERROR_FILE for errors"
    ;;
esac

exit $PROPS_UPDATED
