// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Card,
  Frame,
  Layout,
  Link,
  Loading,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Stack,
  TextContainer,
  TextStyle,
  FormLayout,
  TextField,
  Select,
  Modal,
  Banner,
  ContextualSaveBar,
  Toast
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup } from '../../../components';
import { parseDateLabel } from '../../../utils/Common';

import './Account.scss';

export function Account({ user }) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalChangePwdActive, setModalChangePwdActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);
  const [error, setError] = useState(false);
  const [pwdError, setPwdError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), [])

  const [defaultState, setDefaultState] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [dateCreated, setDateCreated] = useState('');

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
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/account`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          email: email,
        })
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        // Update localstorage only if it is my account
        let tmp = await asyncLocalStorage.getItem('user');
        tmp = tmp && JSON.parse(tmp);
        // @ts-ignore
        if (tmp && tmp.email === defaultState.email) {
          // @ts-ignore
          tmp = {
            firstname: firstname,
            lastname: lastname,
            email: email,
          }
          await asyncLocalStorage.setItem('user', JSON.stringify(tmp));
        }
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
  }, [firstname, lastname, email, defaultState.email, handleDiscard]);

  /** 
   * Delete account 
   */
  const handleModalChange = useCallback(async () => {
    setModalActive(!modalActive);
  }, [modalActive]);

  const handleDelete = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/account`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        // Redirect
        window.location.href = '/settings/account';
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
      handleDiscard();
      setError(true);
    }
  }, [handleDiscard]);

  /** 
   * Change Password 
   */
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleModalChangePwd = useCallback(async () => {
    setModalChangePwdActive(!modalChangePwdActive);
  }, [modalChangePwdActive]);

  const handleUpdatePwd = useCallback(async () => {
    try {
      if (newPassword !== repeatNewPassword) {
        setPasswordError(true);
        return;
      }
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/account/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: password,
          newPassword: newPassword
        })
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        // Enable toast
        setActive(true);
      } else if (response.status === 'wrong_password') {
        setPwdError(true);
      } else {
        setError(true);
      }
      setModalChangePwdActive(false);
    } catch (error) {
      console.log(error);
      handleDiscard();
      setError(true);
    }
  }, [newPassword, repeatNewPassword, password, handleDiscard]);

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
  const handlePasswordChange = useCallback((e) => {
    setPassword(e);
  }, []);
  const handleNewPasswordChange = useCallback((e) => {
    setNewPassword(e);
  }, []);
  const handleRepeatNewPasswordChange = useCallback((e) => {
    setRepeatNewPassword(e);
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
    // contextControl={contextControlMarkup}
    />
  ) : null;

  /**
   * Fetch account data
   */
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/account/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();


        if (response.status === 'success') {
          setDefaultState({
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            email: response.data.email,
          });
          setFirstname(response.data.firstname);
          setLastname(response.data.lastname);
          setEmail(response.data.email);
          setDateCreated(response.data.date_created);

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

  const bannerWrongPwdMarkup = pwdError && (
    <Layout.Section>
      <Banner
        title="Password errata"
        status="critical"
        onDismiss={() => setPwdError(false)}
      >
        <p>Si è pregati di ricontrollare la password.</p>
      </Banner>
    </Layout.Section>
  )

  const modalMarkup = (
    <Modal
      open={modalActive}
      onClose={handleModalChange}
      title="Rimozione account"
      primaryAction={{
        content: 'Continua',
        onAction: handleDelete,
        destructive: true,
        loading: buttonSpinning
      }}
      secondaryActions={[
        {
          content: 'Cancella',
          onAction: handleModalChange,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            Si è sicuri di voler procedere con la rimozione dell'account?
          </p>
          <p>
            Una volta che si è proceduto non è possibile tornare indietro.
            Sarà necessario creare un nuovo account.
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  )

  /** Change Pwd */
  const modalChangePwdMarkup = (
    <Modal
      open={modalChangePwdActive}
      onClose={handleModalChangePwd}
      title="Cambia la tua password"
      primaryAction={{
        content: 'Continua',
        onAction: handleUpdatePwd,
        loading: buttonSpinning
      }}
      secondaryActions={[
        {
          content: 'Cancella',
          onAction: handleModalChangePwd,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          {passwordError && (
            <FormLayout.Group>
              <Banner
                title="La nuova password non coincide"
                status="critical"
              >
                <p>Si è pregati di ricontrollare.</p>
              </Banner>
            </FormLayout.Group>
          )}
          <FormLayout.Group>
            <TextField autoComplete="off" type="password" label="Password attuale" value={password} onChange={handlePasswordChange} />
          </FormLayout.Group>
          <FormLayout.Group>
            <TextField autoComplete="off"
              type="password"
              label="Nuova password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </FormLayout.Group>
          <FormLayout.Group>
            <TextField autoComplete="off"
              type="password"
              label="Conferma nuova password"
              value={repeatNewPassword}
              onChange={handleRepeatNewPasswordChange}
            />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  )

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title="Account"
      breadcrumbs={[{ content: 'Impostazioni', url: '/settings' }]}
    >
      <Layout>
        {/* Banner */}
        {bannerMarkup}
        {bannerWrongPwdMarkup}
        {/* Panoramica account */}
        <Layout.AnnotatedSection
          title="Panoramica dell'account"
          description="Visualizza Termini e condizioni del servizio e informativa sulla privacy."
        >
          <Card sectioned>
            <Stack distribution="fill">
              <Stack>
                <TextContainer spacing="tight">
                  <p><TextStyle variation="strong">Membro dal</TextStyle></p>
                  <p>{parseDateLabel(new Date(dateCreated))}</p>
                </TextContainer>
              </Stack>
              <Stack>
                <TextContainer spacing="tight">
                  <p><TextStyle variation="strong">Piano attuale</TextStyle></p>
                  <p>-</p>
                </TextContainer>
              </Stack>
              <Stack>
                <TextContainer spacing="tight">
                  <p><TextStyle variation="strong">Stato</TextStyle></p>
                  <p>-</p>
                </TextContainer>
              </Stack>
            </Stack>
          </Card>
        </Layout.AnnotatedSection>
        {/* Dettagli account */}
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
                  helpText="Verrà utilizzato per l'accesso all'account."
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          title="Password"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <Button
                  onClick={() => setModalChangePwdActive(true)}
                >
                  Cambia la password
                </Button>
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
        <TopBarMarkup vcDate={vcDate} setVcDate={setVcDate} handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {contextualSaveBarMarkup}
      {pageMarkup}
      {modalMarkup}
      {modalChangePwdMarkup}
      {toastMarkup}
    </Frame>
  );
}

