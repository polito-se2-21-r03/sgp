// @ts-nocheck

import React, { useCallback, useRef, useState, useEffect } from 'react';

import {
  Button,
  Card,
  DatePicker,
  Frame,
  Icon,
  Layout,
  Loading,
  Modal,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TextStyle,
  Toast,
  TextField,
  Banner,
  Stack,
  Sticky,
  Heading,
  FormLayout
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup } from '../../../components';
import { AddedProductRow } from './AddedProductRow';
import { CartRow } from './CartRow';
import {
  CancelSmallMinor,
  CartMajor,
  MinusMinor,
  PlusMinor
} from '@shopify/polaris-icons';

import dayjs from 'dayjs';

import './ClientsProductAll.scss';
import { transform } from 'typescript';
import {getCachedData} from "../../../utils/CacheUtils";

export function ClientsProductAll({ user, vcDate, setVcDate }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [onCart, setOnCart] = useState([]);
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

  const [modalActive, setModalActive] = useState(false);
  const handleModalChange = useCallback(() => setModalActive(!modalActive), [modalActive]);
  const [selected, setSelected] = useState('pickup');
  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const options = [
    { label: 'In store pick up', value: 'pickup' },
    { label: 'Home bag delivery', value: 'bagdelivery' },
  ];
  const date = dayjs().add(1, "day").toDate();
  const [{ month, year }, setDate] = useState({ month: date.getMonth(), year: date.getFullYear() });
  const [selectedDates, setSelectedDates] = useState({
    start: date,
    end: date,
  });
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  const [time, setTime] = useState('08:30');
  const [timeError, setTimeError] = useState(false);
  const handleTimeChange = useCallback((e) => {
    const getMs = (t) => {
      return (Number(t.split(':')[0]) * 60 + Number(t.split(':')[1])) * 60 * 1000;
    }
    if (getMs(e) < getMs('08:30') || getMs(e) > getMs('17:30')) {
      setTimeError(true);
    }
    else {
      setTimeError(false);
      setTime(e);
    }
  }, []);

  const [addedItems, setAddedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const loadingMarkup = isLoading ? <Loading /> : null;

  const [defaultInput, setDefaultInput] = useState(dayjs().format('YYYY/MM/DD'));
  const [virtualDate, setVirtualDate] = useState(dayjs().format('YYYY/MM/DD'));
  const [virtualTime, setVirtualTime] = useState(dayjs().format('HH:mm'));
  useEffect(() => {
    const getVirtualTime = async () => {
      const virtualTime = await getCachedData('virtual-clock','http://localhost:3000')
      if(virtualTime){
        setDefaultInput(dayjs(virtualTime).format('YYYY/MM/DD'));
        setVirtualDate(dayjs(virtualTime).format('YYYY/MM/DD'))
        setVirtualTime(dayjs(virtualTime).format('HH:mm'))
      }
    }
    getVirtualTime();
  }, [])

  /** 
   * Date picker 
   */
  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );

  /** Date picker selected date handler */
  const handleSelectedDate = useCallback((e) => {
    setSelectedDates({
      start: e.start,
      end: e.end,
    });
  }, []);


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
          const disable = [];
          for (const item of response) {
            item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            item["farmer"] = farmers[item.producerId];
            tmp.push(item);
            disable.push(false);
          }
          setItems(tmp);
          setOnCart(disable);
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
      producerId: product.producerId
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
          obj.amount += Number(quantity);
        }
      });
    }

    let sum = 0;
    tmp.forEach(obj => {
      sum += obj.amount * obj.price;
    });

    setTotal(sum);

    setAddedItems(tmp);
  }, [total, addedItems]);

  /** Handle update cart product */
  const handleUpdateCartProduct = useCallback((product, quantity) => {
    const tmp = addedItems;
    const disable = onCart;

    let counter = 0;
    for (const item of tmp) {
      if (item.productId === product.productId) {
        // If quantity is zero remove product
        if (Number(quantity) === 0) {
          tmp.splice(counter, 1);
          counter = 0;
          disable[product.productId - 1] = false;
          setOnCart(disable);
        } else {
          item.amount = Number(quantity);
        }
        break;
      }
      counter++;
    }

    // Calcoli del carrello
    let sum = 0;
    tmp.forEach(obj => {
      sum += obj.amount * obj.price;
    });
    setTotal(sum);

    setAddedItems(tmp);
  }, [total, addedItems]);

  /**
   * Save data
   */
  const handleSave = useCallback(async (selectedDates, time, address, city, zip, selected) => {
    try {
      console.log(selectedDates.start, time, address, city, zip);
      const milliseconds = selectedDates.start.getTime() + (Number(time.split(':')[0]) * 60 + Number(time.split(':')[1])) * 60 * 1000;
      const newDate = (new Date(milliseconds)).toISOString();
      console.log(newDate, selected);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/order', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: user.id,
          employeeId: 1,
          products: addedItems,
          address: address + " " + city + " " + zip,
          datetime: newDate,
          type: selected == "bagdelivery" ? "DELIVERY" : "PICK-UP"
        })
      })
      const response = await data.json();
      if (response.orderId) {
        setModalActive(false);
      }
      if (response.status === 'not_available') {
        setAmountError(true);
      } else if (response.status === 'failed') {
        setSaveError(true);
      } else {
        setActive(true);
        setAddedItems([]);
        setTotal(0);
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
              onCart={onCart}
              setOnCart={setOnCart}
            />
          </Card>
        </Layout.Section>
      );
    });

  const addedProductsMarkup = addedItems.map(
    (item, index) => {

      return (
        <Layout.Section
          oneThird
          key={index}
        >
          <CartRow
            key={item.productId}
            item={item}
            name={frontItems[item.productId - 1].name}
            updateProduct={handleUpdateCartProduct}
            total={total}
          />
        </Layout.Section>
      );
    }
  )

  const cartMarkup = (
    <div className="custom-button">
      <Button
        icon={CartMajor}
        onClick={() => window.location.href = '#cart'}
        size="large"
      />
    </div>
  )

  const cartTitle = (
    <Stack>
      <Icon source={CartMajor} />
      <Heading>Cart</Heading>
    </Stack>
  )

  /**
 * Modal top up
 */
  const modalMarkup = (
    <Modal
      open={modalActive}
      onClose={handleModalChange}
      title="Plan your order"
      primaryAction={{
        content: 'Place order',
        onAction: () => handleSave(selectedDates, time, address, city, zip, selected),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleModalChange,
        },
      ]}
    >
      <Modal.Section>
        <Select
          label="Delivery type"
          options={options}
          onChange={handleSelectChange}
          value={selected}
        />

        {selected === 'pickup' && (
          <div style={{ marginTop: '1.6rem' }}>
            <FormLayout>
              <FormLayout.Group>
                <Stack vertical wrap>
                  <DatePicker
                    month={month}
                    year={year}
                    onChange={handleSelectedDate}
                    onMonthChange={handleMonthChange}
                    selected={selectedDates}
                    disableDatesBefore={dayjs().toDate()}
                  />
                  <TextField
                    autoComplete="off"
                    label="Time"
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    error={timeError && "You can only pick up your order from 08:30 to 17:30"}
                  />
                </Stack>
              </FormLayout.Group>
            </FormLayout>
          </div>
        )}
        {selected === 'bagdelivery' && (
          <div style={{ marginTop: '1.6rem' }} >
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  autoComplete="off"
                  label="Address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    console.log(e, address);
                    return setAddress(e)
                  }
                  }
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  autoComplete="off"
                  label="City"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e)}
                />
                <TextField
                  autoComplete="off"
                  label="Postal code"
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e)}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <DatePicker
                  month={month}
                  year={year}
                  onChange={handleSelectedDate}
                  onMonthChange={handleMonthChange}
                  selected={selectedDates}
                  disableDatesBefore={dayjs().toDate()}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  autoComplete="off"
                  label="Time"
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  error={timeError && "You can only pick up your order from 08:30 to 17:30"}
                />
              </FormLayout.Group>
            </FormLayout>
          </div>
        )}
      </Modal.Section>
    </Modal>
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
        title="The desired quantity is not available"
        status="warning"
        onDismiss={() => setAmountError(false)}
      >
        <p>Please, adjust your desired quantity.</p>
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
        {errorAmountMarkup}
        {/* First column */}
        <Layout.Section>
          <Layout>
            {productsListMarkup}
          </Layout>
        </Layout.Section>
        {/* Second column */}
        <Layout.Section secondary>
          <Sticky offset>
            <br />
            <br />
            <br />
            <div id='cart'>
              <Card title={cartTitle} sectioned>
                <div>
                  {addedItems.length > 0 && (
                    <div style={{ paddingBottom: '5px' }}><TextStyle variation="strong">Products:</TextStyle></div>
                  )}
                  {addedProductsMarkup}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <p><TextStyle variation="strong">Total</TextStyle>: {Number(total).toFixed(2)} €</p>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <Button
                    primary
                    onClick={() => setModalActive(true)}
                    disabled={total === 0}
                  >
                    Plan order
                  </Button>
                </div>
              </Card>
            </div>
          </Sticky>
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
        <TopBarMarkup vcDate={vcDate} setVcDate={setVcDate} handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {loadingMarkup}
      {pageMarkup}
      {toastMarkup}
      {cartMarkup}
      {modalMarkup}
    </Frame >
  );
}