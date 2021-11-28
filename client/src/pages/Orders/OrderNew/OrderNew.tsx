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
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

import { AddedProductRow } from './AddedProductRow';

export function OrderNew({ user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [active, setActive] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [customer, setCustomer] = useState(-1);
  const [addedItems, setAddedItems] = useState([]);
  const [total, setTotal] = useState(0);

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
      console.log(addedItems)

      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/order', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: customer,
          // Employee ID set to 1 for testing
          employeeId: 1,
          products: addedItems
        })
      })
      const response = await data.json();

      if (response) {
        setActive(true);
        setTimeout(() => {
          history.push(`/orders`);
        }, 3000);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    setIsDirty(false);
  }, [customer, addedItems, history]);

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
  const deselectedOptions = [
    { value: '1', label: 'Apples' },
    { value: '2', label: 'Tomatoes' },
  ]
  const [productOptions, setProductOptions] = useState(deselectedOptions);

  const productsMap = new Map();
  productsMap.set(1, {
    productId: 1,
    quantity: 300,
    price: 2.3
  })
  productsMap.set(2, {
    productId: 2,
    quantity: 1000,
    price: 4.6
  })

  /**
   * Search customers
   */
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState([]);
  const [inputCustomerValue, setInputCustomerValue] = useState('');
  const deselectedCustomerOptions = [
    { value: '1', label: 'Francesco' },
    { value: '2', label: 'Alessandro' },
  ]
  const [customerOptions, setCustomerOptions] = useState(deselectedCustomerOptions);

  /**
   * Fetch data: 
   * - products
   * - customers
   */
  useEffect(() => {
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

        if (response.status === 'success') {
          let tmp = [];
          for (const item of response.data) {
            tmp.push({ value: item._id, label: item.label });
          }
          // @ts-ignore
          setDeselectedOptions(tmp);
          // @ts-ignore
          setJobOptions(tmp);
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

        if (response.status === 'success') {
          let tmp = [];
          for (const item of response.data) {
            tmp.push({ value: item._id, label: item.label });
          }
          // @ts-ignore
          setDeselectedAtecoOptions(tmp);
          // @ts-ignore
          setAtecoOptions(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts();
    fetchCustomers();
  }, []);

  /**
   * Autocomplete Controls
   */

  /** Product */
  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setProductOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) => {
        // @ts-ignore
        return option.label.match(filterRegex)
      });
      setProductOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem: any) => {
        const matchedOption = productOptions.find((option) => {
          // @ts-ignore
          return option.value.match(selectedItem);
        });
        // @ts-ignore
        return matchedOption;
      });
      setSelectedOptions(selected);
      setInputValue(selectedValue[0].label);

      // Add product
      const tmp = addedItems;
      const product = productsMap.get(Number(selectedValue[0].value));
      const item = {
        productId: product.productId,
        amount: 1,
        price: product.price,
      }

      // Check if product is already present
      let found = 0;
      tmp.forEach(obj => {
        // @ts-ignore
        if (obj.productId === item.productId)
          found = 1;
      });

      if (!found) {
        // @ts-ignore
        tmp.push(item);
        setTotal(total + item.amount * item.price);
      }

      setAddedItems(tmp);
    },
    [productOptions, total]
  );

  const productTextField = (
    <Autocomplete.TextField
      onChange={updateText}
      label=""
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search"
    />
  );

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
    />
  );

  /**
   * Added products markup
   * deselectedOptions[productId - 1].label
   */
  const addedProductsMarkup = addedItems.map(item => {
    const { productId, amount, price } = item;

    return (
      <AddedProductRow
        key={productId}
        item={item}
        label={deselectedOptions[productId - 1].label}
        updateTotal={setTotal}
        total={total}
      />
    );
  })

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="Order has been created." onDismiss={toggleActive} />
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
      breadcrumbs={[{ content: 'Orders', url: '/orders' }]}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}
        {/* First column */}
        <Layout.Section>
          {/* Product */}
          <Card title="Products" sectioned>
            <Autocomplete
              options={productOptions}
              selected={selectedOptions}
              onSelect={updateSelection}
              textField={productTextField}
            />
            <div style={{ marginTop: '16px' }}>
              {addedProductsMarkup}
            </div>
          </Card>
          {/* Payment */}
          <Card title="Payment" sectioned>
            <Stack distribution="equalSpacing">
              <Stack.Item>
                <TextStyle variation="strong">Total</TextStyle>
              </Stack.Item>
              <Stack.Item>
                <TextStyle variation="strong">€ {total.toFixed(2)}</TextStyle>
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

  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

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
      {contextualSaveBarMarkup}
      {loadingMarkup}
      {pageMarkup}
      {toastMarkup}
    </Frame>
  );
}

