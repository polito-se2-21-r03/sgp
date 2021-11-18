import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { AppProvider } from '@shopify/polaris';
import itTranslation from '@shopify/polaris/locales/it.json';
import enTranslation from '@shopify/polaris/locales/en.json';

import logo from './logo_transparent.png';

ReactDOM.render(
  <AppProvider
    theme={{
      logo: {
        width: 109,
        contextualSaveBarSource:
          logo
      },
    }}
    i18n={enTranslation}
  >
    <App />
  </AppProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
