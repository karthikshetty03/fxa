/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import { storiesOf } from '@storybook/react';
import Tooltip from './index';

storiesOf('Components|Tooltip', module)
  .add('default', () => (
    <div className="p-20 max-w-md">
      <div className="mb-3">
        <div className="relative">
          <p>Default tooltip pointing to this text</p>
          <Tooltip msg="My tooltip message here" />
        </div>
      </div>
    </div>
  ))
  .add('Error', () => (
    <div className="p-20 max-w-md">
      <div className="mb-3">
        <div className="relative">
          <p>Error tooltip pointing to this </p>
          <Tooltip type="error" msg="My tooltip message here" />
        </div>
      </div>
    </div>
  ));
