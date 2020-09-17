/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { LocationProvider } from '@reach/router';
import { ConnectedServices } from '.';
import { MockedCache } from '../../models/_mocks';

storiesOf('Components|ConnectedServices', module)
  .addDecorator((getStory) => <LocationProvider>{getStory()}</LocationProvider>)
  .add('default', () => (
    <MockedCache account={{ recoveryKey: false, totp: { exists: false } }}>
      <ConnectedServices />
    </MockedCache>
  ));
