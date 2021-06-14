#!/usr/bin/env ts-node

import { get, request } from 'https';
import { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';

const w3cPropsUrl = 'https://www.w3.org/Style/CSS/all-properties.en.json';
const outputFile = resolve(module.path, '../src/css-props.json');

const lastUpdateFile = resolve(module.path, '../.css-props-updated');
const lastUpdated = new Date(
  parseInt(readFileSync(lastUpdateFile).toString(), 10)
);

let timeout: any = null;

const errorHandler = (err: Error) => {
  console.error(err);
  process.exit(1);
};

const download = (lastModified: Date) => {
  if (lastUpdated.getTime() >= lastModified.getTime()) {
    console.warn("W: CSS props list hasn't changed since last update");
    console.log(`last update: ${lastUpdated.toUTCString()}`);
    console.log(`last-modified: ${lastModified.toUTCString()}`);
    clearTimeout(timeout);
    process.exit();
  }

  console.info(`Requesting ${w3cPropsUrl}`);
  const req = get(w3cPropsUrl, res => {
    let jsonString = '';
    let firstReceived = false;

    res.on('data', data => {
      if (firstReceived) {
        process.stdout.write('.');
      } else {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        process.stdout.write('Receiving.');
        firstReceived = true;
      }
      jsonString += data;
    });

    res.on('end', () => {
      process.stdout.write('\n');
      console.info('Parsing and filtering css-property names');
      const parsed = JSON.parse(jsonString);
      const propNames = Array.from(
        new Set(parsed.map((prop: any) => prop.property))
      );

      console.info(`Writing to ${outputFile}`);
      writeFileSync(outputFile, JSON.stringify(propNames));
      writeFileSync(lastUpdateFile, lastModified.getTime().toString());
    });
  });

  req.on('error', errorHandler);

  req.end();
};

console.info(`Checking ${w3cPropsUrl}`);
request(
  {
    hostname: 'www.w3.org',
    port: 443,
    path: '/Style/CSS/all-properties.en.json',
    method: 'HEAD'
  },
  res => {
    download(new Date(res.headers['last-modified'] || 0));
  }
)
  .on('error', errorHandler)
  .end();

timeout = setTimeout(() => {
  console.error('Aborting after 10 seconds without response');
  process.exit(1);
}, 10000);
