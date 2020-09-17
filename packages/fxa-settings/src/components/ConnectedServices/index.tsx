/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState } from 'react';
import { AlertBar } from '../AlertBar';
import { ButtonIconReload } from '../ButtonIcon';
import { useAlertBar } from 'fxa-settings/src/lib/hooks';
import { useAccount, useLazyAccount } from '../../models';
import { LinkExternal } from 'fxa-react/components/LinkExternal';

const UTM_PARAMS =
  '?utm_source=accounts.firefox.com&utm_medium=referral&utm_campaign=fxa-devices';
const DEVICES_SUPPORT_URL =
  'https://support.mozilla.org/kb/fxa-managing-devices' + UTM_PARAMS;

export const ConnectedServices = () => {
  const alertBar = useAlertBar();
  const [errorText, setErrorText] = useState<string>();
  const onError = (e: Error) => {
    setErrorText(e.message);
    alertBar.show();
  };
  const [getAccount, { accountLoading }] = useLazyAccount((error) => {
    setErrorText('Sorry, there was a problem refreshing the recovery key.');
    alertBar.show();
  });

  return (
    <section
      className="mt-11"
      id="connected-services"
      data-testid="settings-connected-services"
    >
      <h2 className="font-header font-bold ml-4 mb-4">Connected Services</h2>
      <div className="bg-white tablet:rounded-xl shadow">
        <div className="flex">
          <p>Everything you are using and signed into.</p>
          <ButtonIconReload
            title="Refresh connected services"
            classNames="hidden mobileLandscape:inline-block"
            testId="connected-services-refresh"
            disabled={accountLoading}
            onClick={getAccount}
          />
        </div>

        <div className="border-1 border-solid">
          **placeholder** iterate over attachedClients in account here and pass
          them into UnitRow elements.
        </div>

        <LinkExternal
          href={DEVICES_SUPPORT_URL}
          className="link-blue text-sm mt-2 opacity-75 hover:opacity-100 focus:opacity-100"
        >
          Missing or duplicate items?
        </LinkExternal>

        {alertBar.visible && (
          <AlertBar
            onDismiss={alertBar.hide}
            type={errorText ? 'error' : 'success'}
          >
            {errorText ? (
              <p data-testid="delete-recovery-key-error">
                Error text TBD. {errorText}
              </p>
            ) : (
              <p data-testid="delete-recovery-key-success">
                Account recovery key removed
              </p>
            )}
          </AlertBar>
        )}
      </div>
    </section>
  );
};

export default ConnectedServices;
