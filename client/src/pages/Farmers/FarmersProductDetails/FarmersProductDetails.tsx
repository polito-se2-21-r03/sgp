// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Autocomplete,
  Button,
  Card,
  ContextualSaveBar,
  DatePicker,
  FormLayout,
  Frame,
  Icon,
  Layout,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TextField,
  Toast,
  Banner
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import './FarmersProductDetails.scss';
import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';
import { Item } from '@shopify/polaris/dist/types/latest/src/components/Stack/components';

export function FarmersProductDetails({ user, match }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [saveError, setSaveError] = useState(false);

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

  /**
   * Product States
   */
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [type, setType] = useState('');
  const [url, setUrl] = useState('');
  const [ufm, setUfm] = useState('Kg');

  const ufmOptions = [
    { label: 'Kg', value: 'Kg' },
    { label: 'L', value: 'L' },
    { label: 'Unit', value: 'Units' },
  ];

  const [defaultState, setDefaultState] = useState({
    quantity: ''
  });

  const handleDiscard = useCallback(() => {
    setQuantity(defaultState.quantity);
    setIsDirty(false);
  }, [defaultState]);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/farmer/${user.id}/product/${match.params.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      const response = await data.json();

      if (response.status === 'failed') {
        setSaveError(true);
        setIsDirty(false);
      } else if (response) {
        setActive(true);
        setTimeout(() => {
          history.push(`/`);
        }, 3000);
        setIsDirty(false);
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  /**
   * Product Handlers
   */
  const handleNameChange = useCallback((e) => {
    setName(e);
  }, []);
  const handleDescriptionChange = useCallback((e) => {
    setDescription(e);
  }, []);
  const handlePriceChange = useCallback((e) => {
    setPrice(e);
  }, []);
  const handleQuantityChange = useCallback((e) => {
    setQuantity(e);
    setIsDirty(true);
  }, []);
  const handleTypeChange = useCallback((e) => {
    setType(e);
  }, []);
  const handleUrlChange = useCallback((e) => {
    setUrl(e);
  }, []);
  const handleUfmChange = useCallback((value) => setUfm(value), []);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message={"Product not saved"}
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
   * Fetch data
   * - Fetch product
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/product/${match.params.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response) {

          setName(response.name);
          setDescription(response.description);
          setUrl(response.src);
          setQuantity(String(response.quantity));
          setUfm(response.unitOfMeasure);
          setPrice(String(response.price));
          setType(response.type);

          setDefaultState({ quantity: String(response.quantity) });

          setIsLoading(false);
          return clientId;
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, [])

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="Product has been updated." onDismiss={toggleActive} />
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
      title={name}
      breadcrumbs={[{ content: 'Products', url: '/products' }]}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}

        {/* Left section */}
        <Layout.Section>
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField type="text" label="Title" value={name} onChange={handleNameChange} disabled />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  maxLength={200}
                  autoComplete="off"
                  showCharacterCount
                  disabled
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField type="text" label="Image url" value={url} onChange={handleUrlChange} disabled />
              </FormLayout.Group>
            </FormLayout>
          </Card>
          <Card title="Inventory (next week availability)" sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  type="number"
                  label="Available"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <Select
                  label="Unit of measure"
                  options={ufmOptions}
                  onChange={handleUfmChange}
                  value={ufm}
                  disabled
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  type="text"
                  label="Price"
                  value={price}
                  suffix="EUR"
                  onChange={handlePriceChange}
                  disabled
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.Section>

        {/* Right section */}
        <Layout.Section secondary>
          <Card title="Organization" sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  type="text"
                  label="Category"
                  value={type}
                  onChange={handleTypeChange}
                  disabled
                />
              </FormLayout.Group>
            </FormLayout>
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

