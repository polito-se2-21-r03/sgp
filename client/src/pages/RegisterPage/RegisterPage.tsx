import React, { useCallback, useState } from 'react';

import { Button, Form, FormLayout, TextField, InlineError, Banner } from "@shopify/polaris";

import asyncLocalStorage from '../../utils/async-localstorage';

import './Register.css';
import logo from '../../logo_transparent.png';
import { useHistory } from 'react-router';

export function RegisterPage() {
  const history = useHistory();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveError, setSaveError] = useState(false);
  const [existError, setExistError] = useState(false);
  const [active, setActive] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);

  const handleSubmit = useCallback(async (_event) => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/client', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          email: email,
          phone: phone,
          password: password,
          is_tmp_password: 0
        })
      })
      const response = await data.json();

      if (response.status === 'customer_exists') {
        setExistError(true);
      } else if (response) {
        setActive(true);
        setTimeout(() => {
          history.push(`/login`);
        }, 3000);
      } else {
        setSaveError(true);
      }
      setButtonSpinning(false);

    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  const handleEmailChange = useCallback((value) => setEmail(value), []);
  const handlePwdChange = useCallback((value) => setPassword(value), []);

  /**
   * Error markups & toast
   */
  const saveMarkup = active && (
    <div style={{ marginBottom: '16px' }}>
      <Banner
        title="User has been created"
        status="success"
        onDismiss={() => setActive(false)}
      >
        <p>You will be redirected to the login page.</p>
      </Banner>
    </div>
  )

  const saveErrorMarkup = saveError && (
    <div style={{ marginBottom: '16px' }}>
      <Banner
        title="An error occurred"
        status="critical"
        onDismiss={() => setSaveError(false)}
      >
        <p>Please try again later.</p>
      </Banner>
    </div>
  )

  const existErrorMarkup = existError && (
    <div style={{ marginBottom: '16px' }}>
      <Banner
        title="A customer with this email already exists"
        status="critical"
        onDismiss={() => setExistError(false)}
      >
        <p>Please check the email and try again.</p>
      </Banner>
    </div>
  )

  return (
    <div className="page-main">
      <div className="page-content" style={{ maxWidth: '56.8rem' }}>
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
              <h2 className="ui-heading">Register</h2>
              <h3 className="ui-subheading ui-subheading--subdued">Sign up to access the platform</h3>
              {/* Banners */}
              {saveMarkup}
              {saveErrorMarkup}
              {existErrorMarkup}
              {/* Form */}
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      value={firstname}
                      onChange={(e) => setFirstname(e)}
                      label="Name"
                      type="text"
                    />
                    <TextField
                      value={lastname}
                      onChange={(e) => setLastname(e)}
                      label="Surname"
                      type="text"
                    />
                  </FormLayout.Group>
                  <TextField
                    value={phone}
                    onChange={(e) => setPhone(e)}
                    label="Phone"
                    type="text"
                  />
                  <TextField
                    value={email}
                    onChange={handleEmailChange}
                    label="Email"
                    type="email"
                  />
                  <TextField
                    value={password}
                    onChange={handlePwdChange}
                    label="Password"
                    type="password"
                  />
                  <FormLayout.Group>
                    <Button primary size="large" loading={buttonSpinning} submit>Register</Button>
                  </FormLayout.Group>
                </FormLayout>
              </Form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}