/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require('fs');
const intern = require('intern').default;
const args = require('yargs').argv;
const firefoxProfile = require('./tools/firefox_profile');

// Tests
const testsMain = require('./functional');

const fxaAuthRoot = args.fxaAuthRoot || 'http://localhost:9000/v1';
const fxaContentRoot = args.fxaContentRoot || 'http://localhost:3030/';
const fxaOAuthRoot = args.fxaOAuthRoot || 'http://localhost:9000';
const fxaProfileRoot = args.fxaProfileRoot || 'http://localhost:1111';
const fxaTokenRoot = args.fxaTokenRoot || 'http://localhost:5000/token';
const fxaEmailRoot = args.fxaEmailRoot || 'http://localhost:9001';
const fxaOAuthApp = args.fxaOAuthApp || 'http://localhost:8080/';
const fxaUntrustedOauthApp =
  args.fxaUntrustedOauthApp || 'http://localhost:10139/';
const fxaPaymentsRoot = args.fxaPaymentsRoot || 'http://localhost:3031/';
const output = args.output || 'test-results.xml';

const fxaToken = args.fxaToken || 'http://';
const asyncTimeout = parseInt(args.asyncTimeout || 5000, 10);

// On Circle, we bail after the first failure.
// args.bailAfterFirstFailure comes in as a string.
const bailAfterFirstFailure = args.bailAfterFirstFailure === 'true';

const testProductId = args.testProductId || 'prod_GqM9ToKK62qjkK';

// Intern specific options are here: https://theintern.io/docs.html#Intern/4/docs/docs%2Fconfiguration.md/properties
const config = {
  asyncTimeout: asyncTimeout,
  bail: bailAfterFirstFailure,
  defaultTimeout: 45000, // 30 seconds just isn't long enough for some tests.
  environments: {
    browserName: 'firefox',
    fixSessionCapabilities: 'no-detect',
    usesHandleParameter: true,
  },
  filterErrorStack: true,
  functionalSuites: testsMain,

  fxaAuthRoot: fxaAuthRoot,
  fxaContentRoot: fxaContentRoot,
  fxaEmailRoot: fxaEmailRoot,
  fxaOAuthApp: fxaOAuthApp,
  fxaOAuthRoot: fxaOAuthRoot,
  fxaProfileRoot: fxaProfileRoot,
  fxaToken: fxaToken,
  fxaTokenRoot: fxaTokenRoot,
  fxaUntrustedOauthApp: fxaUntrustedOauthApp,
  fxaPaymentsRoot,

  pageLoadTimeout: 20000,
  reporters: 'runner',
  serverPort: 9091,
  serverUrl: 'http://localhost:9091',
  socketPort: 9077,
  tunnelOptions: {
    drivers: [
      {
        name: 'firefox',
        version: '0.26.0',
      },
    ],
  },

  testProductId,
};

if (args.grep) {
  config.grep = new RegExp(args.grep, 'i');
}

config.capabilities = {};
config.capabilities['moz:firefoxOptions'] = {};
// to create a profile, give it the `config` option.
config.capabilities['moz:firefoxOptions'].profile = firefoxProfile(config); //eslint-disable-line camelcase
// uncomment to show devtools on launch
// config.capabilities['moz:firefoxOptions'].args = ['-devtools'];

// custom Firefox binary location, if specified then the default is ignored.
// ref: https://code.google.com/p/selenium/wiki/DesiredCapabilities#WebDriver
if (args.firefoxBinary) {
  config.capabilities['moz:firefoxOptions'].binary = args.firefoxBinary; //eslint-disable-line camelcase
}

const failed = [];

intern.on('testEnd', (test) => {
  if (test.error) {
    failed.push(test);
  }
});

intern.on('afterRun', () => {
  if (failed.length) {
    fs.writeFileSync('rerun.txt', failed.map((f) => f.name).join('|'));
  }
});

intern.configure(config);
intern.run().catch((e) => {
  // This might not throw, BUG filed: https://github.com/theintern/intern/issues/868
  console.log(e);
  process.exit(1);
});
