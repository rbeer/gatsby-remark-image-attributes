#!/usr/bin/env node

const get = require('https').get;
const resolve = require('path').resolve;
const writeFileSync = require('fs').writeFileSync;

const w3cPropsUrl = 'https://www.w3.org/Style/CSS/all-properties.en.json';
const outputFile = resolve(module.path, '../src/css-props.json');

let timeout = null;

console.info(`Requesting ${w3cPropsUrl}`);
const req = get(w3cPropsUrl, res => {
  let jsonString = '';
  let firstReceived = false;

  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  res.on('data', data => {
    if (firstReceived) {
      process.stdout.write('.');
    } else {
      process.stdout.write('Receiving.');
      firstReceived = true;
    }
    jsonString += data;
  });

  res.on('end', () => {
    process.stdout.write('\n');
    console.info('Parsing and filtering css-property names');
    const parsed = JSON.parse(jsonString);
    const propNames = Array.from(new Set(parsed.map(prop => prop.property)));

    console.info(`Writing to ${outputFile}`);
    writeFileSync(outputFile, JSON.stringify(propNames));
  });
});

req.on('error', err => {
  console.error(err);
  process.exit(1);
});

req.end();

timeout = setTimeout(() => {
  console.error('Aborting after 10 seconds without response');
  process.exit(1);
}, 10000);
