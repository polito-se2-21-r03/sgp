import React, { useCallback, useState } from 'react';
import { ActionList, TopBar } from '@shopify/polaris';

import { contextControlMarkup } from '../ContextControlMarkup';
import { CircleRightMajor } from '@shopify/polaris-icons';

import asyncLocalStorage from '../../utils/async-localstorage';

export function TopBarMarkup({ handleMobileNavigation }: any) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const user = JSON.parse(String(localStorage.getItem('user')));

  const handleSearchFieldChange = useCallback((value) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);
  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false);
    setSearchValue('');
  }, []);
  const toggleMobileNavigationActive = useCallback(() => {
    setMobileNavigationActive(
      (mobileNavigationActive) => !mobileNavigationActive,
    )
    handleMobileNavigation(mobileNavigationActive);
  }, [handleMobileNavigation, mobileNavigationActive]);
  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    [],
  );

  /** Logout */
  const logout = async () => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const response = await data.json();

      if (response.status === 'success') {
        await asyncLocalStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      console.log(error);
    }
  }

  const userMenuActions = [
    {
      items: [{
        content: 'Logout',
        icon: CircleRightMajor,
        onAction: async () => await logout()
      }],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={user.firstname + ' ' + user.lastname}
      initials={user.firstname[0] + user.lastname[0]}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
      colorScheme="dark"
      accessibilityLabel="User menu"
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[{ content: 'NANO Platform help center' }]}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Cerca"
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      // searchResultsVisible={searchActive}
      // searchField={searchFieldMarkup}
      // searchResults={searchResultsMarkup}
      // onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNavigationActive}
      contextControl={contextControlMarkup}
      searchResultsOverlayVisible
    />
  );

  return topBarMarkup;
}