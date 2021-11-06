import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Card,
  Frame,
  Layout,
  Loading,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, CompaniesList } from '../../../../components';

import './CompaniesAll.scss';

export function CompaniesAll({ user }: any) {
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

  const handleMobileNavigation = (data: any) => {
    setMobileNavigationActive(
      (data) => !data,
    )
  }

  const loadingMarkup = isLoading ? <Loading /> : null;

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      fullWidth
      title="Compagnie"
      breadcrumbs={[{ content: 'Impostazioni', url: '/settings' }]}
      primaryAction={
        <Button
          primary
          url='/settings/companies/new'
        >
          Aggiungi compagnia
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <CompaniesList user={user} />
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

  return (
    <Frame
      topBar={
        < TopBarMarkup handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {loadingMarkup}
      {pageMarkup}
    </Frame >
  );
}