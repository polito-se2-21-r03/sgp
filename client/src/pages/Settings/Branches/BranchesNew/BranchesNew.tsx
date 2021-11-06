import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  OptionList,
  Modal,
  Card,
  ContextualSaveBar,
  FormLayout,
  Frame,
  Layout,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Stack,
  TextContainer,
  TextField,
  Autocomplete,
  Icon,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup, ModifiableOptionList, ModalWithList } from '../../../../components';

import './BranchesNew.scss';
import { SearchMinor } from '@shopify/polaris-icons';

export function BranchesNew({ user }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);

  const [newBranchName, setNewBranchName] = useState('');


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

  const handleDiscard = useCallback(() => {
    setNewBranchName('');
    setIsDirty(true);
  }, []);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      //@ts-ignore
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/users/branches/${JSON.parse(localStorage.getItem('user')).id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          branch_name: newBranchName
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        // Redirect
        window.location.href = '/branches';
      } else {
        console.log('err');
      }
    } catch (error) {
      console.log(error);
    }
    setIsDirty(false);
  }, [newBranchName]);

  /** Handler */
  const handleNewBranchNameChange = useCallback((e) => {
    setNewBranchName(e);
  }, []);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Modifiche non salvate"
      saveAction={{
        onAction: handleSave,
      }}
      discardAction={{
        onAction: handleDiscard,
        discardConfirmationModal: true,
      }}
      contextControl={contextControlMarkup}
    />
  ) : null;

  const loadingMarkup = isLoading ? <Loading /> : null;

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Nuovo Ramo'
      breadcrumbs={[{ content: 'Rami', url: '/settings/branches' }]}
    >
      <Layout>
        <Layout.Section></Layout.Section>
        {/* Panoramica cliente */}
        <Layout.AnnotatedSection
          title="Dati Nuovo Ramo"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField type="text" label="Nome ramo" value={newBranchName} onChange={handleNewBranchNameChange} />
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

  return (
    <Frame
      topBar={
        <TopBarMarkup handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {contextualSaveBarMarkup}
      {loadingMarkup}
      {pageMarkup}
    </Frame>
  );
}

