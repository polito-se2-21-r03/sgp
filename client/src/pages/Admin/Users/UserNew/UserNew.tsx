import React, { useCallback, useRef, useState } from 'react';

import {
  Banner,
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
  Toast,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../../components';

import './UserNew.scss';
import { useHistory } from 'react-router';

export function UserNew({ match, user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [error, setError] = useState(false);
  const [exist, setExist] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), [])

  const [defaultState, setDefaultState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
  });
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');

  // Role options
  const options = [];
  const userRole = user && user.role;
  if (userRole === 'admin') {
    options.push(
      { label: 'Admin', value: 'admin' },
      { label: 'Manager', value: 'manager' },
      { label: 'Analyst', value: 'analyst' },
      { label: 'Resource', value: 'resource' });
  } else {
    options.push(
      { label: 'Manager', value: 'manager' },
      { label: 'Analyst', value: 'analyst' },
      { label: 'Resource', value: 'resource' });
  }
  const [role, setRole] = useState((userRole === 'admin') ? 'admin' : 'manager');

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
    setFirstname(defaultState.firstname);
    setLastname(defaultState.lastname);
    setEmail(defaultState.email);
    setIsDirty(false);
  }, [defaultState]);

  /** 
   * Save data 
   */
  const handleSave = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/admin/users/new`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          email: email,
          role: role
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setButtonSpinning(false);
        setTimeout(() => {
          history.push(`/admin/users/${response.data._id}`);
        }, 3000);
      } else if (response.status === 'user_exists') {
        setExist(true);
        setButtonSpinning(false);
      } else {
        setError(true);
        setButtonSpinning(false);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setButtonSpinning(false);
    }
    setIsDirty(false);
  }, [firstname, lastname, email, role, history]);

  /** Handler */
  const handleFirstnameChange = useCallback((e) => {
    setFirstname(e);
    setIsDirty(true);
  }, []);
  const handleLastnameChange = useCallback((e) => {
    setLastname(e);
    setIsDirty(true);
  }, []);
  const handleEmailChange = useCallback((e) => {
    setEmail(e);
    setIsDirty(true);
  }, []);
  const handleSelectChange = useCallback((value) => setRole(value), []);

  const loadingMarkup = isLoading ? <Loading /> : null;

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Utente non salvato"
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
   * Markups & error
   */
  const saveError = error && (
    <Layout.Section>
      <Banner
        title="Si è verificato un errore nel salvataggio dei dati"
        status="critical"
        onDismiss={() => setError(false)}
      >
        <p>Si è pregati di riprovare più tardi.</p>
      </Banner>
    </Layout.Section>
  )

  const existError = exist && (
    <Layout.Section>
      <Banner
        title="Esiste già un utente associato a questo indirizzo email"
        status="critical"
        onDismiss={() => setExist(false)}
      >
        <p>Si è pregati di cambiare l'email utente se si desidera proseguire.</p>
      </Banner>
    </Layout.Section>
  )

  const toastMarkup = active ? (
    <Toast content="L'account è stato creato con successo." onDismiss={toggleActive} />
  ) : null;

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title={`${defaultState.firstname} ${defaultState.lastname}`}
      breadcrumbs={[{ content: 'Utenti', url: '/admin/users' }]}
    >
      <Layout>
        {/* Banner */}
        {saveError}
        {existError}
        {/* Panoramica account */}
        <Layout.AnnotatedSection
          title="Dettagli account"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField autoComplete="off" type="text" label="Nome" value={firstname} onChange={handleFirstnameChange} />
                <TextField autoComplete="off" type="text" label="Cognome" value={lastname} onChange={handleLastnameChange} />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField autoComplete="off"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                  helpText="Verrò utilizzato per l'accesso all'account."
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          title="Ruolo account"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <Select
                  label="Ruolo"
                  options={options}
                  onChange={handleSelectChange}
                  value={role}
                  helpText="In base al ruolo l'utente avrà viste diverse."
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
      {contextualSaveBarMarkup}
      {pageMarkup}
      {toastMarkup}
    </Frame>
  );
}

