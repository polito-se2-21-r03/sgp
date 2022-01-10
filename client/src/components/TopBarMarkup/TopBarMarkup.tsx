import React, { useCallback, useState } from 'react';
import { ActionList, Button, TopBar, Stack } from '@shopify/polaris';

import { contextControlMarkup } from '../ContextControlMarkup';
import { CircleRightMajor, QuestionMarkMajor } from '@shopify/polaris-icons';

import asyncLocalStorage from '../../utils/async-localstorage';
import { useHistory } from 'react-router';

import { TopBarDatePicker } from '../TopBarDatePicker';

export function TopBarMarkup({ handleMobileNavigation, vcDate, setVcDate }: any) {
  const history = useHistory();

  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const toggleIsSecondaryMenuOpen = useCallback(() =>
    setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen), []);

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

      if (response) {
        await asyncLocalStorage.removeItem('user');
        history.push('/login');
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
      initials={user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase()}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
      colorScheme="dark"
      accessibilityLabel="User menu"
      detail={user.role}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[{ content: 'SPG Platform help center' }]}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Cerca"
    />
  );

  const secondaryMenuMarkup = (
    <TopBar.Menu
      // activatorContent={
      //   <span>
      //     <Icon source={QuestionMarkMajor} />
      //     <VisuallyHidden>Secondary menu</VisuallyHidden>
      //   </span>
      // }
      activatorContent={<TopBarDatePicker vcDate={vcDate} setVcDate={setVcDate} />}
      open={isSecondaryMenuOpen}
      onOpen={toggleIsSecondaryMenuOpen}
      onClose={toggleIsSecondaryMenuOpen}
      actions={[]}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      secondaryMenu={secondaryMenuMarkup}
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