/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const { registerSuite } = intern.getInterface('object');
const FunctionalHelpers = require('./lib/helpers');
const selectors = require('./lib/selectors');

const config = intern._config;
const ENTER_EMAIL_URL = config.fxaContentRoot;
const PASSWORD = 'amazingpassword';

const {
  clearBrowserState,
  click,
  createEmail,
  createUser,
  fillOutEmailFirstSignIn,
  openPage,
  openRP,
  subscribeToTestProduct,
  subscribeToTestProductWithCardNumber,
  testElementExists,
  testElementTextInclude,
  visibleByQSA,
} = FunctionalHelpers;

const TEST_PRODUCT_URL = `${config.fxaContentRoot}subscriptions/products/${config.testProductId}`;

registerSuite('subscriptions', {
  tests: {
    'visit product page without signing in, expect to see product name displayed in sub-header': function () {
      if (
        process.env.CIRCLECI === 'true' &&
        !process.env.SUBHUB_STRIPE_APIKEY
      ) {
        this.skip('missing Stripe API key in CircleCI run');
      }
      return this.remote
        .then(
          clearBrowserState({
            '123done': true,
            force: true,
          })
        )
        .then(openPage(TEST_PRODUCT_URL, selectors.ENTER_EMAIL.HEADER))
        .then(
          testElementTextInclude(
            selectors.ENTER_EMAIL.SUB_HEADER,
            'Continue to 123Done Pro'
          )
        );
    },

    'sign up, subscribe for 123Done Pro, sign into 123Done to verify subscription': function () {
      if (
        process.env.CIRCLECI === 'true' &&
        !process.env.SUBHUB_STRIPE_APIKEY
      ) {
        this.skip('missing Stripe API key in CircleCI run');
      }
      const email = createEmail();
      return this.remote
        .then(
          clearBrowserState({
            '123done': true,
            force: true,
          })
        )
        .then(createUser(email, PASSWORD, { preVerified: true }))
        .then(openPage(ENTER_EMAIL_URL, selectors.ENTER_EMAIL.HEADER))
        .then(fillOutEmailFirstSignIn(email, PASSWORD))
        .then(testElementExists(selectors.SETTINGS.HEADER))

        .then(openRP())
        .then(click(selectors['123DONE'].BUTTON_SIGNIN))
        .then(testElementExists(selectors.SIGNIN_PASSWORD.HEADER))
        .then(click(selectors['SIGNIN_PASSWORD'].SUBMIT_USE_SIGNED_IN))
        .then(testElementExists(selectors['123DONE'].AUTHENTICATED))
        .then(visibleByQSA(selectors['123DONE'].BUTTON_SUBSCRIBE))

        .then(click(selectors['123DONE'].LINK_LOGOUT))
        .then(visibleByQSA(selectors['123DONE'].BUTTON_SIGNIN))

        .then(subscribeToTestProduct())

        .then(openRP())
        .then(click(selectors['123DONE'].BUTTON_SIGNIN))
        .then(testElementExists(selectors.SIGNIN_PASSWORD.HEADER))
        .then(click(selectors['SIGNIN_PASSWORD'].SUBMIT_USE_SIGNED_IN))
        .then(testElementExists(selectors['123DONE'].AUTHENTICATED))
        .then(visibleByQSA(selectors['123DONE'].SUBSCRIBED));
    },
    'sign up, failed to subscribe due to expired CC': function () {
      if (
        process.env.CIRCLECI === 'true' &&
        !process.env.SUBHUB_STRIPE_APIKEY
      ) {
        this.skip('missing Stripe API key in CircleCI run');
      }
      const email = createEmail();
      return this.remote
        .then(
          clearBrowserState({
            '123done': true,
            force: true,
          })
        )
        .then(createUser(email, PASSWORD, { preVerified: true }))
        .then(openPage(ENTER_EMAIL_URL, selectors.ENTER_EMAIL.HEADER))
        .then(fillOutEmailFirstSignIn(email, PASSWORD))
        .then(testElementExists(selectors.SETTINGS.HEADER))

        .then(openRP())
        .then(click(selectors['123DONE'].BUTTON_SIGNIN))
        .then(testElementExists(selectors.SIGNIN_PASSWORD.HEADER))
        .then(click(selectors['SIGNIN_PASSWORD'].SUBMIT_USE_SIGNED_IN))
        .then(testElementExists(selectors['123DONE'].AUTHENTICATED))
        .then(visibleByQSA(selectors['123DONE'].BUTTON_SUBSCRIBE))

        .then(click(selectors['123DONE'].LINK_LOGOUT))
        .then(visibleByQSA(selectors['123DONE'].BUTTON_SIGNIN))

        .then(subscribeToTestProductWithCardNumber('4000000000000069'))

        .then(testElementTextInclude('.error-message-container', 'expired'));
    },
  },
});
