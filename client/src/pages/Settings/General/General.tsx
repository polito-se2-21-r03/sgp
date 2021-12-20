import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Banner,
  Card,
  ContextualSaveBar,
  FormLayout,
  Frame,
  Layout,
  Loading,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TextField,
  Toast,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import './General.scss';

export function General({ match, user }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);
  const [error, setError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), [])

  const [defaultState, setDefaultState] = useState({
    name: '',
    email: '',
    customerEmail: '',
    phone: '',
    city: '',
    address: '',
    province: '',
    postalCode: ''
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

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

  /** Discard */
  const handleDiscard = useCallback(() => {
    setName(defaultState.name);
    setEmail(defaultState.email);
    setCustomerEmail(defaultState.customerEmail);
    setPhone(defaultState.phone);
    setCity(defaultState.city);
    setAddress(defaultState.address);
    setProvince(defaultState.province);
    setPostalCode(defaultState.postalCode);

    setIsDirty(false);
  }, [defaultState]);

  /** Save data */
  const handleSave = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/general`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          customer_email: customerEmail,
          phone: phone,
          city: city,
          address: address,
          province: province,
          postal_code: postalCode
        })
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        setActive(true);
      } else {
        handleDiscard();
        setError(true);
      }
    } catch (error) {
      console.log(error);
      handleDiscard();
      setError(true);
    }
    setIsDirty(false);
  }, [name, email, customerEmail, phone, city, address, province, postalCode, handleDiscard]);

  /** Handler */
  const handleNameChange = useCallback((e) => {
    setName(e);
    setIsDirty(true);
  }, []);
  const handleEmailChange = useCallback((e) => {
    setEmail(e);
    setIsDirty(true);
  }, []);
  const handleCustomerEmailChange = useCallback((e) => {
    setCustomerEmail(e);
    setIsDirty(true);
  }, []);
  const handlePhoneChange = useCallback((e) => {
    setPhone(e);
    setIsDirty(true);
  }, []);
  const handleCityChange = useCallback((e) => {
    setCity(e);
    setIsDirty(true);
  }, []);
  const handleAddressChange = useCallback((e) => {
    setAddress(e);
    setIsDirty(true);
  }, []);
  const handleProvinceChange = useCallback((e) => {
    setProvince(e);
    setIsDirty(true);
  }, []);
  const handlePostalCodeChange = useCallback((e) => {
    setPostalCode(e);
    setIsDirty(true);
  }, []);


  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Modifiche non salvate"
      saveAction={{
        onAction: handleSave,
        loading: buttonSpinning
      }}
      discardAction={{
        onAction: handleDiscard,
        discardConfirmationModal: true,
      }}
      contextControl={contextControlMarkup}
    />
  ) : null;

  /**
   * Company settings
   */
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/general`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          setDefaultState({
            name: response.data.name,
            email: response.data.email,
            customerEmail: response.data.customer_email,
            phone: response.data.phone,
            city: response.data.city,
            address: response.data.address,
            province: response.data.province,
            postalCode: response.data.postal_code
          });
          setName(response.data.name);
          setEmail(response.data.email);
          setCustomerEmail(response.data.customer_email);
          setPhone(response.data.phone);
          setCity(response.data.city);
          setAddress(response.data.address);
          setProvince(response.data.province);
          setPostalCode(response.data.postal_code);

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchAccount();
  }, [active])

  const bannerMarkup = error && (
    <Layout.Section>
      <Banner
        title="Si è verificato un errore nell'aggiornamento dei dati"
        status="critical"
        onDismiss={() => setError(false)}
      >
        <p>Si è pregati di riprovare più tardi.</p>
      </Banner>
    </Layout.Section>
  )

  const loadingMarkup = isLoading ? <Loading /> : null;

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title="Generali"
      breadcrumbs={[{ content: 'Impostazioni', url: '/settings' }]}
    >
      <Layout>
        {/* Banner */}
        {bannerMarkup}
        {/* Company details */}
        <Layout.AnnotatedSection
          title="Dettagli della compagnia"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField autoComplete="off" type="text" label="Nome" value={name} onChange={handleNameChange} />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField autoComplete="off"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField autoComplete="off"
                  type="email"
                  label="Email per le notifiche ai clienti"
                  value={customerEmail}
                  onChange={handleCustomerEmailChange}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField autoComplete="off"
                  type="text"
                  label="Telefono"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
        {/* Company address */}
        <Layout.AnnotatedSection
          title="Indirizzo della compagnia"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField autoComplete="off"
                  type="text"
                  label="Indirizzo"
                  value={address}
                  onChange={handleAddressChange}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField autoComplete="off"
                  type="text"
                  label="Provincia"
                  value={province}
                  onChange={handleProvinceChange}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField autoComplete="off"
                  type="text"
                  label="Città"
                  value={city}
                  onChange={handleCityChange}
                />
                <TextField autoComplete="off"
                  type="email"
                  label="Codice postale"
                  value={postalCode}
                  onChange={handlePostalCodeChange}
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
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

  const toastMarkup = active ? (
    <Toast content="I dati sono stati aggiornati" onDismiss={toggleActive} />
  ) : null;

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

