import React, { useCallback, useState } from 'react';

import { Button, Form, FormLayout, TextField, InlineError, Loading, Toast, Frame, Banner } from "@shopify/polaris";

import './ForgotPasswordPage.css';
import logo from '../../nano_b.svg';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notExist, setNotExist] = useState(false);

  const loadingMarkup = isLoading ? <Loading /> : null;

  const handleSubmit = useCallback(async (_event) => {
    try {
      setIsLoading(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      })
      const response = await data.json();
      setIsLoading(false);

      if (response.status === 'success') {
        setActive(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else if (response.status === 'user_notexists') {
        setNotExist(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [email]);

  const handleEmailChange = useCallback((value) => setEmail(value), []);

  const toggleActive = useCallback(() => setActive((active) => !active), [])
  const toastMarkup = active ? (
    <Toast content="È stata inviata l'email contenente la nuova password" onDismiss={toggleActive} />
  ) : null;

  const existError = notExist && (
    <div style={{ "marginBottom": "3rem" }}>
      <Banner
        title="Non esiste nessun utente associato a questo indirizzo email"
        status="critical"
        onDismiss={() => setNotExist(false)}
      >
      </Banner>
    </div>
  )

  return (
    <Frame>
      {loadingMarkup}

      <div className="page-main">
        <div className="page-content">
          <div className="login-card ">
            <header className="login-card__header">
              <h1 className="login-card__logo">
                <a href="">
                  <img src={logo} />
                </a>
              </h1>
            </header>

            <div className="login-card__content">
              <div className="main-card-section">
                <h2 className="ui-heading">Recupera la password</h2>
                <h3 className="ui-subheading ui-subheading--subdued">Ti verrà inviata una email con una nuova password</h3>
                {existError}
                <Form onSubmit={handleSubmit}>
                  <FormLayout>
                    <TextField
                      value={email}
                      onChange={handleEmailChange}
                      label="Email"
                      type="email"
                    />
                    {(error === true) ? (
                      <InlineError message="Qualcosa è andato storto. Riprovare più tardi." fieldID="myFieldID" />
                    ) : ''}
                    <Button primary size="large" submit>Recupera</Button>
                  </FormLayout>
                </Form>

              </div>
            </div>
          </div>
          <footer className="login-footer">
            <a className="login-footer__link" target="_blank" href="#" title="Help Center">Assistenza</a>
            <a className="login-footer__link" target="_blank" href="#" title="Privacy Policy">Privacy</a>
            <a className="login-footer__link" target="_blank" href="#" title="Terms of service">Termini</a>
          </footer>
        </div>

        {toastMarkup}
      </div>
    </Frame>
  )
}