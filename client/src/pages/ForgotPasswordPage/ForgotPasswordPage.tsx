import React, { useCallback, useState } from 'react';

import { Button, Form, FormLayout, TextField, InlineError, Loading, Toast, Frame, Banner } from "@shopify/polaris";

import './ForgotPasswordPage.css';
import logo from '../../logo_transparent.png';
import { useHistory } from 'react-router';

export function ForgotPasswordPage() {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({ password })
      })
      const response = await data.json();
      setIsLoading(false);

      if (response.status === 'success') {
        setActive(true);
        setTimeout(() => {
          history.push('/');
        }, 3000);
      } else if (response.status === 'user_notexists') {
        setNotExist(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [password]);

  const handleEmailChange = useCallback((value) => setEmail(value), []);
  const handlePasswordChange = useCallback((value) => setPassword(value), []);

  const toggleActive = useCallback(() => setActive((active) => !active), [])
  const toastMarkup = active ? (
    <Toast content="Password has been updated" onDismiss={toggleActive} />
  ) : null;

  const existError = notExist && (
    <div style={{ "marginBottom": "3rem" }}>
      <Banner
        title="User with this email does not exist."
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
                <h2 className="ui-heading">Reset your password</h2>
                <h3 className="ui-subheading ui-subheading--subdued">Insert a new password for your account</h3>
                {existError}
                <Form onSubmit={handleSubmit}>
                  <FormLayout>
                    <TextField
                      value={email}
                      onChange={handleEmailChange}
                      label="Email"
                      type="email"
                    />
                    <TextField
                      value={password}
                      onChange={handlePasswordChange}
                      label="Password"
                      type="password"
                    />
                    {(error === true) ? (
                      <InlineError message="Something goes wrong. Please try again later." fieldID="myFieldID" />
                    ) : ''}
                    <Button primary size="large" submit>Reset</Button>
                  </FormLayout>
                </Form>

              </div>
            </div>
          </div>
        </div>

        {toastMarkup}
      </div>
    </Frame>
  )
}