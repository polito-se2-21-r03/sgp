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
  Autocomplete,
  Icon,
  Banner,
  Toast,
  Stack,
  TextStyle,
  EmptyState,
  Badge
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

import { AddedProductRow } from './AddedProductRow';

export function OrderDetails({ match, user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [update, setUpdate] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [customer, setCustomer] = useState(-1);
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

      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/order/${match.params.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          changedBy: 'EMPLOYEE',
          // Employee ID set to 1 for testing
          status: 'PENDING',
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
   * Search products
   */
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [deselectedOptions, setDeselectedOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  /**
   * Search customers
   */
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState([]);
  const [inputCustomerValue, setInputCustomerValue] = useState('');
  const [deselectedCustomerOptions, setDeselectedCustomerOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

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
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/order/${match.params.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();
        const farmers = await fetchFarmers();
        let clientId;

        if (response) {
          const tmp = [];
          const tmp_added = [];
          let sum = 0;
          for (const item of response.products) {
            item["farmer"] = farmers[item.producerId];
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
          clientId = response.clientId;
          setCustomer(response.clientId);
          setStatus(response.status);
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
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/product', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();
        const farmers = await fetchFarmers();

        if (response) {
          let tmp = [];
          for (const item of response) {
            // tmp.push({ value: String(item.id), label: item.name });
            item["farmer"] = farmers[item.producerId];
            tmp.push(item);
            // tmp.push({ value: String(item.id), label: `${item.name} - Farmer: ${item.farmer}` });
          }
          // @ts-ignore
          setDeselectedOptions(tmp);
          // @ts-ignore
          setProductOptions(tmp);
          setProducts(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/client', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();
        const customerId = await fetchOrder();

        if (response) {
          const tmp = [];
          for (const item of response) {
            tmp.push({ value: String(item.id), label: `${item.firstname} ${item.lastname}` });
            if (customerId == item.id)
              setInputCustomerValue(`${item.firstname} ${item.lastname}`);
          }
          // @ts-ignore
          setDeselectedCustomerOptions(tmp);
          // @ts-ignore
          setCustomerOptions(tmp);

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCustomers();
    fetchProducts();
  }, [update]);

  /**
   * Autocomplete Controls
   */

  /** Customer */
  const updateCustomerText = useCallback(
    (value) => {
      setInputCustomerValue(value);

      if (value === '') {
        setCustomerOptions(deselectedCustomerOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedCustomerOptions.filter((option) => {
        // @ts-ignore
        return option.label.match(filterRegex)
      });
      setCustomerOptions(resultOptions);
    },
    [deselectedCustomerOptions]
  );

  const updateCustomerSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem: any) => {
        const matchedOption = customerOptions.find((option) => {
          // @ts-ignore
          return option.value.match(selectedItem);
        });
        // @ts-ignore
        return matchedOption;
      });
      setSelectedCustomerOptions(selected);
      setInputCustomerValue(selectedValue[0].label);
      setCustomer(Number(selectedValue[0].value));
    },
    [customerOptions],
  );

  const customerTextField = (
    <Autocomplete.TextField
      onChange={updateCustomerText}
      label=""
      value={inputCustomerValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search"
      disabled
    />
  );

  /**
   * Added products markup
   */
  const addedProductsMarkup = addedItems.map(item => {
    const { id } = item;

    return (
      <AddedProductRow
        key={id}
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
      case 'CREATED':
        return (<Badge progress="incomplete">Created</Badge>);
      case 'DELIVERED':
        return (<Badge progress="partiallyComplete" status="attention">Issued</Badge>);
      case 'PENDING':
        return (<Badge progress="partiallyComplete" status="warning">Pending</Badge>);

      default:
        break;
    }
  }

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

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Order'
      titleMetadata={renderStatusMarkup(status)}
      breadcrumbs={[{ content: 'Orders', url: '/orders' }]}
      primaryAction={{
        content: 'Update order',
        onAction: handleSave,
        primary: true,
      }}
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
            <Autocomplete
              options={customerOptions}
              selected={selectedCustomerOptions}
              onSelect={updateCustomerSelection}
              textField={customerTextField}
            />
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
    </Frame>
  );
}