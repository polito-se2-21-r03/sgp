import React, { useCallback, useState } from 'react';
import {
  AnalyticsMajor,
  CustomersMajor,
  HomeMajor,
  ProductsMajor,
  SettingsMajor,
  NoteMajor,
  FraudProtectUnprotectedMajor,
  OrdersMajor,
} from '@shopify/polaris-icons';

import { Navigation } from '@shopify/polaris';
import { contextControlMarkup } from '../ContextControlMarkup';

export function NavigationMarkup({ user }: any) {
  const [navItemActive, setNavItemActive] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    [],
  );

  let location = window.location.pathname;

  // ---- Navigation ----
  const navigationMarkup = (
    <Navigation location={location} contextControl={contextControlMarkup}>
      <Navigation.Section
        items={[
          {
            label: 'Home',
            icon: HomeMajor,
            onClick: () => {
              toggleIsLoading();
              setNavItemActive('home');
            },
            url: '/',
            exactMatch: true
          },
          {
            label: 'Orders',
            icon: OrdersMajor,
            onClick: () => {
              toggleIsLoading();
              setNavItemActive('orders');
            },
            url: '/orders',
          },
          // {
          //   label: 'Products',
          //   icon: ProductsMajor,
          //   onClick: () => {
          //     toggleIsLoading();
          //     setNavItemActive('products');
          //   },
          //   url: '/products',
          // },
          // {
          //   label: 'Customers',
          //   icon: CustomersMajor,
          //   onClick: () => {
          //     toggleIsLoading();
          //     setNavItemActive('customers');
          //   },
          //   url: '/customers',
          // },
        ]}
      />
      {user && user.role === 'admin' && (
        <Navigation.Section
          title='Admin'
          items={[
            {
              label: 'Utenti',
              icon: CustomersMajor,
              onClick: () => {
                toggleIsLoading();
                setNavItemActive('users');
              },
              url: '/admin/users',
            },
          ]}
        />
      )}
      <Navigation.Section fill items={[]} />
      <Navigation.Section
        items={[
          {
            label: 'Settings',
            icon: SettingsMajor,
            onClick: () => {
              toggleIsLoading();
              setNavItemActive('settings');
            },
            url: '#',
            exactMatch: true
          },
        ]}
      />
    </Navigation>
  );
  return navigationMarkup;
}

const posIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 20"><path d="M8.717 9.46l.77-2.26s-.52-.29-1.57-.29c-2.71 0-4.06 1.8-4.06 3.66 0 2.21 2.22 2.27 2.22 3.61 0 .33-.23.77-.8.77-.87 0-1.9-.88-1.9-.88l-.53 1.73s1.01 1.21 2.97 1.21c1.64 0 2.85-1.22 2.85-3.12 0-2.42-2.7-2.81-2.7-3.85 0-.18.06-.93 1.26-.93.82 0 1.49.35 1.49.35zm-2.34-5.62c-.51.14-.88.57-.94 1.09-.04.42.2.85.7.81s.9-.51 1-.97c.11-.49-.18-1.04-.76-.93zm1.35-2.7c-.32 0-.72.55-.84 1.36l1.6-.39c-.19-.64-.53-.97-.76-.97zm1.93.9c.32.09.62.29.81.58l1.62 2.13c.16.23.196.458.18.78l-.23 4.84-.33 6.68-.1 1.96c0 .13-.01.26-.03.38-.09.49-.51.67-.97.59l-8.65-1.62c-.51-.09-1.07-.15-1.57-.29-.6-.17-.34-1.1-.28-1.55l.36-2.78.82-6.23c.03-.21.05-.42.08-.63.05-.28.17-.55.34-.78l1.68-2.39c.18-.28.47-.48.8-.55l1.21-.3.3-.07c.09-1.58.94-2.79 2.04-2.79.9 0 1.65.86 1.92 2.04zM12 2l3.875 2.616c.168.157.276.37.31.598l1.77 13.008c.05.195 0 .4-.135.55-.13.15-.33.226-.527.2l-3.61-.37.066-1.36.33-6.864.25-5.208c.01-.182-.05-.36-.164-.503L12 2z"/></svg>`;
