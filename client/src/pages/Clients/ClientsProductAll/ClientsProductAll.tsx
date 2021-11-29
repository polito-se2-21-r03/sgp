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
  Banner
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup } from '../../../components';
import { AddedProductRow } from './AddedProductRow';

import dayjs from 'dayjs';

import './ClientsProductAll.scss';

export function ClientsProductAll({ user }: any) {
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

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [addedItems, setAddedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const loadingMarkup = isLoading ? <Loading /> : null;

  /**
   * Product list
   */

  /** Data fetching */
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

        if (response) {
          console.log(response);
          const tmp = [];
          for (const item of response) {
            // item.name = customersMap.get(item.clientId);
            tmp.push(item);
          }

          setItems(tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? 1 : -1));
          setFrontItems(tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? 1 : -1));
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

      if (response) {
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
      return (
        <p key={index}>
          {frontItems[item.productId - 1].name} x{item.amount}
        </p>
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

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      fullWidth
      title={`Welcome, ${user.firstname}`}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}
        {/* First column */}
        <Layout.Section>
          <Layout>
            {productsListMarkup}
          </Layout>
        </Layout.Section>
        {/* Second column */}
        <Layout.Section secondary>
          <Card title="Cart" sectioned>
            <div>
              {addedItems.length > 0 && (
                <TextStyle variation="strong">Products:</TextStyle>
              )}
              {addedProductsMarkup}
            </div>
            <div style={{ marginTop: '16px' }}>
              <p><TextStyle variation="strong">Total</TextStyle>: {Number(total).toFixed(2)} €</p>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Button
                primary
                onClick={handleSave}
                disabled={total === 0}
              >
                Place order
              </Button>
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
      {toastMarkup}
    </Frame >
  );
}