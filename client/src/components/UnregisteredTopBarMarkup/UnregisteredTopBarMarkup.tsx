import React, { useCallback, useState } from 'react';
import { ActionList, Icon, TopBar, VisuallyHidden } from '@shopify/polaris';

import { contextControlMarkup } from '../ContextControlMarkup';
import { CircleRightMajor, QuestionMarkMajor } from '@shopify/polaris-icons';

import asyncLocalStorage from '../../utils/async-localstorage';
import { useHistory } from 'react-router';

import { TopBarDatePicker } from '../TopBarDatePicker';

export function UnregisteredTopBarMarkup({ handleMobileNavigation }: any) {
  const history = useHistory();

  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const toggleIsSecondaryMenuOpen = useCallback(() =>
    setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen), []);

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

  const userMenuActions = [
    {
      items: [{
        content: 'Sign In',
        icon: CircleRightMajor,
        onAction: async () => history.push('login')
      },
      {
        content: 'Sign Up',
        icon: CircleRightMajor,
        onAction: async () => history.push('register')
      }],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={'Access'}
      initials={'SPG'}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
      colorScheme="dark"
      accessibilityLabel="User menu"
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
      activatorContent={<TopBarDatePicker />}
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