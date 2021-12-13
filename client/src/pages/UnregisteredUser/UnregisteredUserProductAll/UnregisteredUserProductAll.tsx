// @ts-nocheck

import React, { useCallback, useRef, useState, useEffect } from 'react';

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
  TextStyle,
  Toast,
  TextField,
  Banner,
  Stack,
  Sticky
} from '@shopify/polaris';

import { UnregisteredTopBarMarkup, NavigationMarkup } from '../../../components';
import { AddedProductRow } from './AddedProductRow';
import {
  CancelSmallMinor,
  CartMajor,
  MinusMinor,
  PlusMinor
} from '@shopify/polaris-icons';

import dayjs from 'dayjs';

import './UnregisteredUserProductAll.scss';

export function UnregisteredUserProductAll({ user }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);
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

  const [active, setActive] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [addedItems, setAddedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const loadingMarkup = isLoading ? <Loading /> : null;

  /**
   * Product list
   */

  /** Data fetching */
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
          const tmp = [];
          for (const item of response) {
            item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            item["farmer"] = farmers[item.producerId];
            tmp.push(item);
          }
          setItems(tmp);
          setFrontItems(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
    fetchProducts();
  }, []);

  /** Add product */
  const handleAddProduct = useCallback((product, quantity) => {
    const tmp = addedItems;
    const item = {
      productId: product.id,
      amount: Number(quantity),
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
    } else {
      tmp.forEach(obj => {
        if (obj.productId === item.productId) {
          obj.amount = Number(quantity);
        }
      });
    }

    let sum = 0;
    tmp.forEach(obj => {
      sum += obj.amount * obj.price;
    });

    setTotal(sum);

    setAddedItems(tmp);
  }, [total]);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/order', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: user.id,
          employeeId: 1,
          products: addedItems
        })
      })
      const response = await data.json();
      if (response.status = 'INSUFFICIENT_AMOUNT') {
        setAmountError(true);
      }
      else if (response) {
        setActive(true);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
  }, [addedItems]);

  /** Markups */
  useEffect(() => {
    if (items.length > 0)
      setIsLoading(false);
  }, [items]);

  const productsListMarkup = frontItems.map(
    (item, index) => {
      const { id, name, price } = item;

      return (
        <Layout.Section
          oneThird
          key={index}
        >
          <Card sectioned>
            <AddedProductRow
              key={id}
              item={item}
              addProduct={handleAddProduct}
              total={total}
            />
          </Card>
        </Layout.Section>
      );
    });

  const addedProductsMarkup = addedItems.map(
    (item, index) => {
      return (<div style={{ paddingTop: '5px' }}>
        <Stack distribution="equalSpacing">
          <Stack.Item>
            <div style={{ transform: 'translateY(50%)' }}>
              <p key={index} style={{ width: '5rem' }}>
                {frontItems[item.productId - 1].name}
              </p>
            </div>
          </Stack.Item>
          <Stack.Item>
            { /* x{item.amount} */}
            <TextField
              label=""
              value={item.amount}
              connectedLeft={
                <Button
                  icon={MinusMinor}
                  onClick={() => { }}
                  disabled={item.amount <= 1 ? true : false}
                />
              }
              connectedRight={
                <Button
                  icon={PlusMinor}
                  onClick={() => { }}
                />
              }
              autoComplete="off"
            />
          </Stack.Item>
          <Stack.Item>
            <div style={{ transform: 'translateY(30%)' }}>
              <Button
                plain
                icon={CancelSmallMinor}
              />
            </div>
          </Stack.Item>
        </Stack>
        <hr />
      </div>
      )
    }
  )

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

  const errorAmountMarkup = amountError && (
    <Layout.Section>
      <Banner
        title="Insufficient wallet balance"
        status="warning"
        onDismiss={() => setAmountError(false)}
      >
        <p>Please, contact the Shop Employee to charge your wallet.</p>
      </Banner>
    </Layout.Section>
  )

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      fullWidth
      title={`Welcome`}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}
        {errorAmountMarkup}
        {/* First column */}
        <Layout.Section>
          <Layout>
            {productsListMarkup}
          </Layout>
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
        < UnregisteredTopBarMarkup handleMobileNavigation={handleMobileNavigation} />
      }
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {loadingMarkup}
      {pageMarkup}
      {toastMarkup}
    </Frame >
  );
}