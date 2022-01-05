// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Card,
  ContextualSaveBar,
  Frame,
  Layout,
  Loading,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  Tooltip,
  Button,
  Banner,
  Toast,
  Stack,
  TextStyle,
  EmptyState,
  Badge,
  Modal
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import { ClipboardMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

import { AddedProductRow } from './AddedProductRow';

export function FarmersOrderDetails({ match, user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [update, setUpdate] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [deleteModalActive, setDeleteModalActive] = useState(false)
  const handleDeleteModalChange = useCallback(() => setDeleteModalActive(!deleteModalActive), [deleteModalActive]);

  const [customer, setCustomer] = useState({});
  const [addedItems, setAddedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');

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

  const handleDiscard = useCallback(() => {
    setIsDirty(true);
  }, []);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      if (customer === -1) return;

      products.forEach(product => {
        product['confirmed'] = 1
      })
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/farmer/${user.id}/order/${match.params.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          changedBy: 'FARMER',
          // Employee ID set to 1 for testing
          status: 'PRODUCT CONFIRMED',
          products: products
        })
      })
      const response = await data.json();

      if (response) {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    setIsDirty(false);
  }, [user.id, products, update]);

  /**
  * Prepare order
  */
  const handlePreparation = useCallback(async () => {
    try {
      if (customer === -1) return;

      products.forEach(product => {
        product['confirmed'] = 1
      })
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/farmer/${user.id}/order/${match.params.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          changedBy: 'FARMER',
          // Employee ID set to 1 for testing
          status: 'PRODUCT CONFIRMED',
          products: products
        })
      })
      const response = await data.json();

      if (response) {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    setIsDirty(false);
  }, [user.id, products, update]);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Order not saved"
      saveAction={{
        onAction: handleSave,
      }}
      discardAction={{
        onAction: handleDiscard,
        discardConfirmationModal: true,
      }}
      contextControl={contextControlMarkup}
    />
  ) : null;

  const loadingMarkup = isLoading ? <Loading /> : null;

  /**
   * Fetch data:
   * - order
   * - products
   * - customers
   */
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/farmer', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();
        const farmers = {};

        if (response) {
          for (const item of response) {
            farmers[item.id] = item.firstname + " " + item.lastname;
          }

          setIsLoading(false);
          return farmers;
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/farmer/${user.id}/order/${match.params.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();
        const farmers = await fetchFarmers();
        let clientId;

        if (response.order) {
          const tmp = [];
          const tmp_added = [];
          let sum = 0;
          for (const item of response.order.products) {
            item["farmer"] = farmers[user.id];
            item.name = `${item.name} - Farmer: ${item.farmer}`;
            const tmp_item = {
              productId: item.id,
              amount: item.amount,
              price: item.price,
            }
            tmp.push(item);
            tmp_added.push(tmp_item);
            sum += item.amount * item.price;
          }
          clientId = response.order.clientId;
          setStatus(response.order.status);
          setAddedItems(tmp);
          setProducts(tmp_added);
          setTotal(sum);

          setIsLoading(false);
          return clientId;
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        const customerId = await fetchOrder();
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/client/${customerId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response) {
          setCustomer(response);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCustomer();
  }, [update]);

  /**
   * Added products markup
   */
  const addedProductsMarkup = addedItems.map(item => {
    const { productId } = item;
    console.log(item);
    return (
      <AddedProductRow
        key={productId}
        item={item}
      />
    );
  })

  /**
   * Render status
   * @param status 
   * @returns 
   */
  const renderStatusMarkup = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (<Badge progress="complete" status="success">Completed</Badge>);
      case 'CONFIRMED':
        return (<Badge progress="incomplete" status="attention">Confirmed</Badge>);
      case 'CREATED':
        return (<Badge progress="incomplete">Created</Badge>);
      case 'DELIVERED':
        return (<Badge progress="partiallyComplete" status="attention">Issued</Badge>);
      case 'PENDING':
        return (<Badge progress="partiallyComplete" status="warning">Pending</Badge>);
      case 'PENDING CANCELATION':
        return (<Badge progress="incomplete" status="critical">Pending cancelation</Badge>);

      default:
        break;
    }
  }

  /**
   * Delete modal markup
   */
  const deleteModalMarkup = (
    <Modal
      open={deleteModalActive}
      onClose={handleDeleteModalChange}
      title="Delete order"
      primaryAction={{
        content: 'Continue',
        onAction: () => console.log('to be implemented'),
        loading: buttonSpinning,
        destructive: true
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleDeleteModalChange,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            Are you sure you want to delete this order?
          </p>
          <p>
            Once you procede, you can not go back.
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  )

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="Order has been updated." onDismiss={toggleActive} />
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

  const renderPrimaryAction = (status) => {
    if (status === 'CREATED') {
      return {
        content: 'Confirm Products',
        onAction: handleSave,
        primary: true,
      }
    } else if (status === 'PENDING CANCELATION') {
      return {
        content: 'Delete',
        onAction: handleDeleteModalChange,
        destructive: true,
      }
    }
    else if (status === 'CONFIRMED') {
      return {
        content: 'Prepare order',
        onAction: handlePreparation,
        primary: true,
      }
    }
  }

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Order'
      titleMetadata={renderStatusMarkup(status)}
      breadcrumbs={[{ content: 'Orders', url: '/farmer/orders' }]}
      primaryAction={renderPrimaryAction(status)}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}
        {/* First column */}
        <Layout.Section>
          {/* Product */}
          <Card title="Products" sectioned>
            {addedProductsMarkup}
          </Card>
          {/* Payment */}
          <Card title="Payment" sectioned>
            <Stack distribution="equalSpacing">
              <Stack.Item>
                <TextStyle variation="strong">Total</TextStyle>
              </Stack.Item>
              <Stack.Item>
                <TextStyle variation="strong">{total.toFixed(2)} €</TextStyle>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
        {/* Second column */}
        <Layout.Section secondary>
          <Card title="Customer" sectioned>
            <div>
              <TextStyle variation="strong">{customer.firstname} {customer.lastname}</TextStyle>
            </div>
            <div>
              <Stack distribution="equalSpacing" spacing="extraTight">
                <Button
                  plain
                  url={`mailto:${customer.email}`}
                >
                  {customer.email}
                </Button>
                <div>
                  <Tooltip content="Copy address" dismissOnMouseOut>
                    <Button
                      plain
                      icon={ClipboardMinor}
                      onClick={() => {
                        navigator.clipboard.writeText(customer.email);
                      }}
                    />
                  </Tooltip>
                </div>
              </Stack>
            </div>
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

  // ---- Error ----
  const errorPageMarkup = (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="An order with this address does not exist"
              image="https://cdn.shopify.com/shopifycloud/web/assets/v1/08f1b23a19257042c52beca099d900b0.svg"
            >
              <p>
                Check the URL and try again.
              </p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : (error ? errorPageMarkup : actualPageMarkup);

  return (
    <Frame
      topBar={
        <TopBarMarkup handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {loadingMarkup}
      {pageMarkup}
      {toastMarkup}
      {deleteModalMarkup}
    </Frame>
  );
}