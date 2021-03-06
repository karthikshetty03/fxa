/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import Header from 'fxa-react/components/Header';
import LogoLockup from 'fxa-react/components/LogoLockup';
import LinkAbout from '../../components/LinkAbout';
import Nav from '../../components/Nav';
import Footer from 'fxa-react/components/Footer';
import './index.scss';

type AppLayoutProps = {
  children: any;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const logoLockup = <LogoLockup>Firefox Accounts Admin Panel</LogoLockup>;

  return (
    <div data-testid="app" className="app">
      <Header left={logoLockup} right={<LinkAbout />} className="header-page" />
      <div className="container content-wrapper">
        <Nav />
        <main>
          <div className="main-container">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
