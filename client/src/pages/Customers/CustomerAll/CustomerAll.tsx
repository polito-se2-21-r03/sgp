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
  Modal,
  TextField,
  Toast,
  Banner
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, CustomerList } from '../../../components';

import './CustomerAll.scss';

export function CustomerAll({ user }: any) {
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

  const [modalActive, setModalActive] = useState(false);
  const handleModalChange = useCallback(() => setModalActive(!modalActive), [modalActive]);

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [saveError, setSaveError] = useState(false);

  const [userId, setUserId] = useState(-1);
  const [amount, setAmount] = useState('');
  const handleAmountChange = useCallback((e) => setAmount(e), []);

  const loadingMarkup = isLoading ? <Loading /> : null;

  const handleTopUpModal = useCallback((id) => {
    setUserId(id);
    handleModalChange();
  }, []);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      if (userId === -1) return;

      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/wallet/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credit: amount
        })
      })
      const response = await data.json();

      if (response) {
        setActive(true);
      } else {
        setSaveError(true);
      }
      handleModalChange();
    } catch (error) {
      console.log(error);
    }
  }, [userId, amount]);

  /**
   * Modal top up
   */
  const modalMarkup = (
    <Modal
      open={modalActive}
      onClose={handleModalChange}
      title="Top up wallet"
      primaryAction={{
        content: 'Top up',
        onAction: () => handleSave(),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleModalChange,
        },
      ]}
    >
      <Modal.Section>
        <TextField
          type="text"
          label="Amount"
          value={amount}
          suffix="USD"
          onChange={handleAmountChange}
        />
      </Modal.Section>
    </Modal>
  )

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="Wallet has been recharged." onDismiss={toggleActive} />
  ) : null;

  const saveErrorMarkup = saveError && (
    <Layout.Section>
      <Banner
        title="An error occurred saving data"
        status="critical"
        onDismiss={() => setSaveError(false)}
      >
        <p>Please try again later.</p>
      </Banner>
    </Layout.Section>
  )

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      fullWidth
      title="Customers"
      primaryAction={
        <Button
          primary
          url='/customers/new'
        >
          Add customer
        </Button>
      }
    >
      <Layout>
        {saveErrorMarkup}
        <Layout.Section>
          <CustomerList handleModal={handleTopUpModal} />
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
      {modalMarkup}
      {toastMarkup}
    </Frame >
  );
}