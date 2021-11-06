import React, { useCallback, useState } from 'react';

import { Button, Form, FormLayout, TextField, InlineError } from "@shopify/polaris";

import asyncLocalStorage from '../../utils/async-localstorage';

import './Login.css';
import logo from '../../nano_b.svg';
import { useHistory } from 'react-router';

export function LoginPage() {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = useCallback(async (_event) => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      })
      const response = await data.json();

      if (response.status === 'success') {
        await asyncLocalStorage.setItem('user', JSON.stringify(response.data));

        // Redirect
        // history.push({
        //   pathname: '/',
        //   state: { user: response.data }
        // });
        window.location.href = '/';
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  const handleEmailChange = useCallback((value) => setEmail(value), []);
  const handlePwdChange = useCallback((value) => setPassword(value), []);

  return (
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
              <h2 className="ui-heading">Accedi</h2>
              <h3 className="ui-subheading ui-subheading--subdued">Continua verso la tua dashboard</h3>
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
                    onChange={handlePwdChange}
                    label="Password"
                    type="password"
                    labelAction={{ content: 'Password dimenticata?', url: '/forgot-password', }}
                  />
                  {(loginError === true) ? (
                    <InlineError message="Controllare i dati di accesso." fieldID="myFieldID" />
                  ) : ''}
                  <Button primary size="large" submit>Login</Button>
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
    </div>
  )
}