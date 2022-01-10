import React, { useCallback, useRef, useState } from 'react';

import {
  Card,
  Frame,
  Icon,
  Layout,
  Loading,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  UnstyledLink,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup } from '../../../components';

import './Settings.scss';
import { BankMajor, CategoriesMajor, ProfileMajor, SettingsMajor } from '@shopify/polaris-icons';

export function Settings({ user, vcDate, setVcDate }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  // ---- Page markup ----
  const style = { "--med-width-rows": 4, '--max-width-rows': 2 } as React.CSSProperties;
  const actualPageMarkup = (
    <Page title="Impostazioni">
      <Layout>
        <Layout.Section>
          <Card>
            <ul className="settingsList" style={style}>
              {/* General settings */}
              {/* <li className="settingsListItem">
                <UnstyledLink url="/settings/general" className="settingsListItemLink">
                  <div className="settingsListItemIcon">
                    <Icon source={SettingsMajor}></Icon>
                  </div>
                  <div>
                    <p className="settingsListItemTitle">Generali</p>
                    <p className="settingsListItemSubtitle">Visualizza e aggiorna i dettagli della società</p>
                  </div>
                </UnstyledLink>
              </li> */}
              {/* Companies settings */}
              <li className="settingsListItem">
                <UnstyledLink url="/settings/companies" className="settingsListItemLink">
                  <div className="settingsListItemIcon">
                    <Icon source={BankMajor}></Icon>
                  </div>
                  <div>
                    <p className="settingsListItemTitle">Compagnie</p>
                    <p className="settingsListItemSubtitle">Visualizza e aggiorna i dettagli delle compagnie</p>
                  </div>
                </UnstyledLink>
              </li>
              {/* Account settings */}
              <li className="settingsListItem">
                <UnstyledLink url="/settings/account" className="settingsListItemLink">
                  <div className="settingsListItemIcon">
                    <Icon source={ProfileMajor}></Icon>
                  </div>
                  <div>
                    <p className="settingsListItemTitle">Account</p>
                    <p className="settingsListItemSubtitle">Visualizza le informazioni relative al tuo account</p>
                  </div>
                </UnstyledLink>
              </li>
              {/* Branches settings */}
              <li className="settingsListItem">
                <UnstyledLink url="/settings/branches" className="settingsListItemLink">
                  <div className="settingsListItemIcon">
                    <Icon source={CategoriesMajor}></Icon>
                  </div>
                  <div>
                    <p className="settingsListItemTitle">Rami</p>
                    <p className="settingsListItemSubtitle">Visualizza e aggiorna i dettagli dei rami</p>
                  </div>
                </UnstyledLink>
              </li>
            </ul>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );

  // ---- Loading ----
  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

  const handleMobileNavigation = (data: any) => {
    setMobileNavigationActive(
      (data) => !data,
    )
  }

  return (
    <Frame
      topBar={
        <TopBarMarkup vcDate={vcDate} setVcDate={setVcDate} handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {loadingMarkup}
      {pageMarkup}
    </Frame>
  );
}

