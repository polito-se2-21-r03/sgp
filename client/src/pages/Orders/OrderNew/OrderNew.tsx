// @ts-nocheck

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Card,
  ContextualSaveBar,
  DatePicker,
  Frame,
  FormLayout,
  Layout,
  Loading,
  Modal,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  Autocomplete,
  Icon,
  Banner,
  TextField,
  Toast,
  Stack,
  TextStyle,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

import { AddedProductRow } from './AddedProductRow';

import dayjs from 'dayjs';

export function OrderNew({ user, vcDate, setVcDate }: any) {
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

  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);

  /**
   * Save data
   */
  const handleSave = useCallback(async (selectedDates, time, address, city, zip, selected) => {
    try {
      if (customer === -1) return;

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
          clientId: customer,
          employeeId: user.id,
          products: addedItems,
          address: address + " " + city + " " + zip,
          datetime: newDate,
          type: selected == "bagdelivery" ? "DELIVERY" : "PICK-UP"
        })
      })
      const response = await data.json();
      if (response.orderId) {
        setTimeout(() => {
          history.push(`/orders`);
        }, 3000);
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
    handleModalChange();
  }, [addedItems, customer]);
  /*
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
          employeeId: user.id,
          products: addedItems
        })
      })
      const response = await data.json();

      if (response) {
        setActive(true);
        setTimeout(() => {
          history.push(`/orders/${response.orderId}`);
        }, 3000);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    setIsDirty(false);
  }, [customer, addedItems, user.id, history]);
*/
  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Order not saved"
      saveAction={{
        onAction: handleModalChange,
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
   * - products
   * - customers
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
          const tmp_opt = [];
          for (const item of response) {
            item["farmer"] = farmers[item.producerId];
            tmp.push(item);
            tmp_opt.push({ value: String(item.id), label: `${item.name} - Farmer: ${item.farmer}` });
          }
          setDeselectedOptions(tmp_opt);
          setProductOptions(tmp_opt);
          setItems(tmp);
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

    const fetchClients = async () => {
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

        if (response) {
          console.log(response)
          const tmp = [];
          for (const item of response) {
            tmp.push({ value: String(item.id), label: `${item.firstname} ${item.lastname}` });
          }
          setDeselectedCustomerOptions(tmp);
          setCustomerOptions(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
    fetchClients();
  }, []);

  /** Handle update cart product */
  const handleUpdateCartProduct = useCallback((product, quantity) => {
    const tmp = addedItems;
    // const disable = onCart;

    let counter = 0;
    for (const item of tmp) {
      if (item.productId === product.productId) {
        // If quantity is zero remove product
        if (Number(quantity) === 0) {
          tmp.splice(counter, 1);
          // counter = 0;
          // disable[product.productId - 1] = false;
          // setOnCart(disable);
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
      const product = items[(Number(selectedValue[0].value)) - 1];
      const item = {
        productId: product.id,
        amount: 1,
        price: product.price,
        producerId: product.producerId,
        unitOfMeasure: product.unitOfMeasure
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
      setInputValue('');
    },
    [productOptions, items, total]
  );

  const productTextField = (
    <Autocomplete.TextField autoComplete="off"
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
    <Autocomplete.TextField autoComplete="off"
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
        updateProduct={handleUpdateCartProduct}
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
        <TopBarMarkup vcDate={vcDate} setVcDate={setVcDate} handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {modalMarkup}
      {contextualSaveBarMarkup}
      {loadingMarkup}
      {pageMarkup}
      {toastMarkup}
    </Frame>
  );
}

