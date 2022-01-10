import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Card,
  DisplayText,
  Frame,
  Heading,
  Layout,
  Loading,
  Page,
  Spinner,
  Stack,
  TextStyle,
  Tooltip,
  EmptyState
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, DashboardDatePicker } from '../../components';

import './Dashboard.scss';

export function Dashboard({ user, vcDate, setVcDate }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleMobileNavigationActive = useCallback(() => {
    setMobileNavigationActive(
      (mobileNavigationActive) => !mobileNavigationActive,
    )
  }, []);

  const handleMobileNavigation = (data: any) => {
    setMobileNavigationActive(true);
  }

  const loadingMarkup = isLoading ? <Loading /> : null;

  /**
   * Analytics
   */
  const [premioNetto, setPremioNetto] = useState(-1);
  const [provvTot, setProvvTot] = useState(-1);
  const [clienti, setClienti] = useState(-1);
  const [scadenze, setScadenze] = useState([]);
  const [frontItems, setFrontItems] = useState([]);

  // Loading
  // useEffect(() => {
  //   if (provvTot !== -1 && clienti !== -1)
  //     setIsLoading(false);
  // }, [clienti, provvTot]);

  // Pass function to DashboardDatePicker
  const handleAnalytics = (data: any) => {
    setPremioNetto(data.premioNetto);
    setProvvTot(data.provvTot);
    setClienti(data.clienti);
    setScadenze(data.scadenze);
    setFrontItems(data.scadenze);
  };

  // Pass function to ScadenzeList
  const handleFrontItems = (data: any) => {
    setFrontItems(data);
  }

  const handleFrontItemsSort = (order: number) => {
    const tmp = [...frontItems];
    // @ts-ignore
    tmp.sort((a, b) => (a.date_scadenza > b.date_scadenza) ? order : -order);
    setFrontItems(tmp);
  }

  // ---- Page markup ----
  const pageMarkupOld = (
    <Page
      fullWidth
      title="Dashboard"
    >
      <div className="dashboardHeader">
        <Stack alignment="center">
          <DashboardDatePicker handleAnalytics={handleAnalytics} />
          <TextStyle variation="subdued">Change time window</TextStyle>
        </Stack>
      </div>
      <div className="dashboardContent">
        {/* First col */}
        <div className="dashboardContentCol">
          <div className="dashboardContentColPadding">
            <Card sectioned>
              <Stack vertical>
                <Tooltip
                  content="Premio netto calcolato a partire dall'inizio dell'anno"
                  dismissOnMouseOut
                  preferredPosition="above"
                >
                  <Heading>
                    <span className="cardTitle">Total sales</span>
                  </Heading>
                </Tooltip>
                {isLoading ? (
                  <Stack distribution="center" alignment="center">
                    <Spinner></Spinner>
                  </Stack>
                ) : (
                  <DisplayText size="large">{Number(premioNetto).toFixed(2)} €</DisplayText>
                )}
              </Stack>
            </Card>
          </div>
        </div>
        {/* Second col */}
        <div className="dashboardContentCol">
          <div className="dashboardContentColPadding">
            <Card sectioned>
              <Stack vertical>
                <Tooltip
                  content="Provvigioni calcolate a partire dall'inizio dell'anno"
                  dismissOnMouseOut
                  preferredPosition="above"
                >
                  <Heading>
                    <span className="cardTitle">Orders</span>
                  </Heading>
                </Tooltip>
                {isLoading ? (
                  <Stack distribution="center" alignment="center">
                    <Spinner></Spinner>
                  </Stack>
                ) : (
                  <DisplayText size="large">{Number(provvTot).toFixed(2)} €</DisplayText>
                )}
              </Stack>
            </Card>
          </div>
        </div>
        {/* Third col */}
        <div className="dashboardContentCol">
          <div className="dashboardContentColPadding">
            {/* Active customers */}
            <Card sectioned>
              <Stack vertical>
                <Tooltip
                  content="Numero di clienti attivi"
                  dismissOnMouseOut
                  preferredPosition="above"
                >
                  <Heading>
                    <span className="cardTitle">Customers</span>
                  </Heading>
                </Tooltip>
                {isLoading ? (
                  <Stack distribution="center" alignment="center">
                    <Spinner></Spinner>
                  </Stack>
                ) : (
                  <DisplayText size="large">{Number(clienti)}</DisplayText>
                )}
              </Stack>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );

  const pageMarkup = (
    <Page
      fullWidth
      title={`Welcome, ${user.firstname}`}
    >
      <Card sectioned>
        <EmptyState
          heading="Manage system"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/e7b58a8b2e612fe6cf6f8c9e53830b70.svg"
        >
          <p>
            Here you can manage your system
          </p>
        </EmptyState>
      </Card>
    </Page>

  )

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
    </Frame >
  );
}

