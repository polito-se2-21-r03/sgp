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
  Banner,
  Toast,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup, } from '../../../../components';

import './CompaniesNew.scss';
import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

export function CompaniesNew({ user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);
  const [exist, setExist] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), [])

  const [newCompanyName, setNewCompanyName] = useState('');


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
    setNewCompanyName('');
    setIsDirty(false);
  }, []);

  /**
   * Autocomplete
   */
  const [deselectedOptions, setDeselectedOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/companies', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          const tmp = response.data.map((item: any) => ({ label: item.name, value: String(item.company_id) }))
          setDeselectedOptions(tmp);
          setOptions(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const updateText = useCallback(
    (value) => {
      setNewCompanyName(value);
      setIsDirty(true);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        // @ts-ignore
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions],
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem: { [Symbol.match](string: string): RegExpMatchArray | null; }) => {
        const matchedOption = options.find((option) => {
          // @ts-ignore
          return option.value.match(selectedItem);
        });
        // @ts-ignore
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected[0]);
      setNewCompanyName(selectedValue[0]);
    },
    [options],
  );

  const AutocompleteField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Nome"
      value={newCompanyName}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search"
    />
  );

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      setButtonSpinning(true);
      //@ts-ignore
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/companies/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_name: newCompanyName,
          company_logo: ""
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setButtonSpinning(false);
        setTimeout(() => {
          history.push(`/settings/companies`);
        }, 3000);
      } else if (response.status === 'company_exists') {
        setExist(true);
        setButtonSpinning(false);
      } else {
        setError(true);
        setButtonSpinning(false);
      }

    } catch (error) {
      console.log(error);
    }
    setIsDirty(false);
  }, [history, newCompanyName]);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Modifiche non salvate"
      saveAction={{
        onAction: handleSave,
        loading: buttonSpinning
      }}
      discardAction={{
        onAction: handleDiscard,
        discardConfirmationModal: true,
      }}
      contextControl={contextControlMarkup}
    />
  ) : null;

  const loadingMarkup = isLoading ? <Loading /> : null;

  /**
   * Markups & error
   */
  const saveError = error && (
    <Layout.Section>
      <Banner
        title="Si è verificato un errore nel salvataggio dei dati"
        status="critical"
        onDismiss={() => setError(false)}
      >
        <p>Si è pregati di riprovare più tardi.</p>
      </Banner>
    </Layout.Section>
  )

  const existError = exist && (
    <Layout.Section>
      <Banner
        title="Esiste già una compagnia con questo nome"
        status="critical"
        onDismiss={() => setExist(false)}
      >
        <p>Si è pregati di cambiare il nome se si desidera proseguire.</p>
      </Banner>
    </Layout.Section>
  )

  const toastMarkup = active ? (
    <Toast content="La compagnia è stata creata con successo." onDismiss={toggleActive} />
  ) : null;

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Nuova compagnia'
      breadcrumbs={[{ content: 'Compagnie', url: '/settings/companies' }]}
    >
      <Layout>
        {/* Banner */}
        {saveError}
        {existError}
        {/* Panoramica compania */}
        <Layout.AnnotatedSection
          title="Dati Nuova Compagnia"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <Autocomplete
                  options={options}
                  selected={selectedOptions}
                  onSelect={updateSelection}
                  textField={AutocompleteField}
                />
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
      {toastMarkup}
    </Frame>
  );
}

