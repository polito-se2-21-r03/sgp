import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  OptionList,
  Modal,
  Card,
  ContextualSaveBar,
  FormLayout,
  Frame,
  Layout,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TextField,
  Autocomplete,
  Icon,
  Banner,
  Toast,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup, } from '../../../components';

import './CustomerNew.scss';
import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

export function CustomerNew({ user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [active, setActive] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [existError, setExistError] = useState(false);
  const [validationNameError, setValidationNameError] = useState(false);
  const [validationLastnameError, setValidationLastnameError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [firstname, setFirstname] = useState('');               //Firstname used as both first name and company name
  const [lastname, setLastname] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
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

  const handleDiscard = useCallback(() => {
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setPostalCode('');
    setIsDirty(true);
  }, []);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      // Check firstname & lastname
      if (firstname === '' || lastname === '') {
        if (firstname === '') setValidationNameError(true);
        if (lastname === '') setValidationLastnameError(true);
        return;
      }

      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/customers/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: firstname + " " + lastname,
          email: email,
          phone: phone,
          address: address,
          city: city,
          postal_code: postalCode,
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setTimeout(() => {
          history.push(`/customers/${response.data._id}`);
        }, 3000);
      } else if (response.status === 'customer_exists') {
        setExistError(true)
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDirty(false);
  }, [firstname, lastname, email, phone, address, city, postalCode, history]);

  /** Handler */
  const handleFirstnameChange = useCallback((e) => {
    setFirstname(e);
    if (validationNameError) setValidationNameError(false);
  }, [validationNameError]);
  const handleLastnameChange = useCallback((e) => {
    setLastname(e);
    if (validationLastnameError) setValidationLastnameError(false);
  }, [validationLastnameError]);
  const handleEmailChange = useCallback((e) => {
    setEmail(e);
  }, []);
  const handlePhoneChange = useCallback((e) => {
    setPhone(e);
  }, []);
  const handleAddressChange = useCallback((e) => {
    setAddress(e);
  }, []);
  const handleCityChange = useCallback((e) => {
    setCity(e);
  }, []);
  const handlePostalCodeChange = useCallback((e) => {
    setPostalCode(e);
  }, []);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Customer not saved"
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
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="Il cliente è stato creato con successo." onDismiss={toggleActive} />
  ) : null;

  const saveErrorMarkup = saveError && (
    <Layout.Section>
      <Banner
        title="Si è verificato un errore nel salvataggio dei dati"
        status="critical"
        onDismiss={() => setSaveError(false)}
      >
        <p>Si è pregati di riprovare più tardi.</p>
      </Banner>
    </Layout.Section>
  )

  const existErrorMarkup = existError && (
    <Layout.Section>
      <Banner
        title="Esiste già un cliente associato a questo codice fiscale"
        status="critical"
        onDismiss={() => setExistError(false)}
      >
        <p>Si è pregati di controllare il codice fiscale se si desidera proseguire.</p>
      </Banner>
    </Layout.Section>
  )

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Customer'
      breadcrumbs={[{ content: 'Customers', url: '/customers' }]}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}
        {existErrorMarkup}
        {/* Panoramica cliente */}
        <Layout.AnnotatedSection
          title="Customer overview"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField type="text" label="Name" value={firstname} onChange={handleFirstnameChange} error={validationNameError && "Il nome è obbligatorio"} />
                <TextField type="text" label="Surname" value={lastname} onChange={handleLastnameChange} error={validationLastnameError && "Il cognome è obbligatorio"} />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField type="email" label="Email" value={email} onChange={handleEmailChange} />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField type="tel" label="Phone number" value={phone} onChange={handlePhoneChange} />
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

