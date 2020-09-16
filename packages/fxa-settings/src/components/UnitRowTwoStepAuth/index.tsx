/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import { gql } from '@apollo/client';
import LinkExternal from 'fxa-react/components/LinkExternal';
import { useBooleanState } from 'fxa-react/lib/hooks';
import { useAlertBar, useMutation } from '../../lib/hooks';
import AlertBar from '../AlertBar';
import Modal from '../Modal';
import UnitRow from '../UnitRow';
import VerifiedSessionGuard from '../VerifiedSessionGuard';
import { useAccount, useLazyAccount } from '../../models';
import { ButtonIconReload } from '../ButtonIcon';

export const DELETE_TOTP_MUTATION = gql`
  mutation deleteTotp($input: DeleteTotpInput!) {
    deleteTotp(input: $input) {
      clientMutationId
    }
  }
`;

export const UnitRowTwoStepAuth = () => {
  const alertBar = useAlertBar();
  const [modalRevealed, revealModal, hideModal] = useBooleanState();
  const { totp: { exists } } = useAccount();

  const [getAccount, { accountLoading }] = useLazyAccount(() => {
    hideModal();
    alertBar.success('Sorry, there was a problem refreshing two-step authentication.');
  });

  const [disableTwoStepAuth] = useMutation(DELETE_TOTP_MUTATION, {
    variables: { input: {} },
    onCompleted: () => {
      hideModal();
      alertBar.success('Two-step authentication disabled.');
    },
    onError: () => {
      hideModal();
      alertBar.error('Two-step authentication could not be disabled.');
    },
    ignoreResults: true,
    update: (cache) => {
      cache.modify({
        fields: {
          account: (existing) => {
            return { ...existing, totp: { exists: false, verified: false } };
          },
        },
      });
    },
  });

  const conditionalUnitRowProps = exists
    ? {
        headerValueClassName: 'text-green-800',
        headerValue: 'Enabled',
        ctaText: 'Change',
        secondaryCtaText: 'Disable',
        secondaryButtonClassName: 'cta-caution',
        revealSecondaryModal: revealModal,
      }
    : {
        headerValue: null,
        noHeaderValueText: 'Not Set',
        ctaText: 'Add',
        secondaryCtaText: undefined,
        revealSecondaryModal: undefined,
      };

  return (
    <UnitRow
      header="Two-step authentication"
      route="/beta/settings/two_step_authentication"
      {...conditionalUnitRowProps}
      headerContent={
        <ButtonIconReload
          title="Refresh two-step authentication"
          classNames="mobileLandscape:hidden"
          disabled={accountLoading}
          onClick={getAccount}
        />
      }
      actionContent={
        <ButtonIconReload
          title="Refresh two-step authentication"
          classNames="hidden mobileLandscape:inline-block"
          testId="two-step-refresh"
          disabled={accountLoading}
          onClick={getAccount}
        />
      }
    >
      <p className="text-sm mt-3">
        Prevent someone else from logging in by requiring a unique code only you
        have access to.
      </p>
      {modalRevealed && (
        <VerifiedSessionGuard
          onDismiss={hideModal}
          onError={(error) => {
            hideModal();
            alertBar.error(error.message);
          }}
        >
          <Modal
            onDismiss={hideModal}
            onConfirm={disableTwoStepAuth}
            headerId="two-step-auth-disable-header"
            descId="two-step-auth-disable-description"
            confirmText="Disable"
            confirmBtnClassName="cta-caution"
          >
            <h2
              className="font-bold text-xl text-center mb-2"
              data-testid="disable-totp-modal-header"
            >
              Disable two-step authentication?
            </h2>
            {/* "replacing recovery codes" link below will actually drop you into
            recovery codes flow in the future. */}
            <p className="text-center">
              You won't be able to undo this action. You also have the option of{' '}
              <LinkExternal
                className="link-blue"
                href="https://support.mozilla.org/en-US/kb/reset-your-firefox-account-password-recovery-keys"
              >
                replacing your recovery codes
              </LinkExternal>
              .
            </p>
          </Modal>
        </VerifiedSessionGuard>
      )}
      {alertBar.visible && (
        <AlertBar onDismiss={alertBar.hide} type={alertBar.type}>
          <p data-testid={`delete-totp-${alertBar.type}`}>{alertBar.content}</p>
        </AlertBar>
      )}
    </UnitRow>
  );
};

export default UnitRowTwoStepAuth;
