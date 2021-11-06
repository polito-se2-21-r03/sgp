// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Card,
  ContextualSaveBar,
  EmptyState,
  Frame,
  Heading,
  Layout,
  Loading,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Stack,
  TextContainer,
  Toast,
  Banner
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup } from '../../../../components';

import './CompaniesDetails.scss';

export function CompaniesDetails({ match, user }: any) {
  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
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

  const [saveError, setSaveError] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [userProvv, setUserProvv] = useState([]);
  const [txtProvv, setTxtProvv] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const handleTxtProvvValue = useCallback((e) => {
    e.persist();

    const newProvvs = txtProvv.map((pro, index) => {
      if (index == e.target.name) {
        pro = e.target.value;
      }
      return pro;
    });
    setIsDirty(true);
    setTxtProvv(newProvvs);
  }, [txtProvv]);

  const loadingMarkup = isLoading ? <Loading /> : null;

  /**
   * Company details
   */
  const [company, setCompany] = useState({});
  const [error, setError] = useState(false);

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchCompaniesAndUserProvv = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/users/${user.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {

          const tmp = response.data.provv_matrix[+match.params.id - 1];
          setCompany(tmp);

          const valueOfCompany = match.params.id;
          const pTmp = response.data.provv_matrix[+valueOfCompany - 1].branches;

          setTxtProvv(() => {
            const newProvvs = pTmp.map((branch) => {
              return branch.provv;
            })
            return newProvvs;
          });

          setUserProvv(pTmp);

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchCompaniesAndUserProvv();
  }, [update, match.params.id, user.id])


  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/settings/companies/${match.params.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provv_vector: txtProvv,
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setUpdate(!update);
        setActive(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDirty(false);
  }, [match.params.id, txtProvv, update]);


  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Modifiche non salvate"
      saveAction={{
        onAction: handleSave,
      }}
    />
  ) : null;


  /**
   * Functions
   */
  const allBranches = useCallback(() => {
    const branches = userProvv.map((branch, index) => {
      const keyValue = index;

      return (
        <Stack key={keyValue} alignment="trailing">
          <Stack.Item fill>
            <p>{branch.branch_name}</p>
          </Stack.Item>
          <Stack.Item>
            <input type="text" id={"t" + keyValue} name={keyValue} value={txtProvv[keyValue]} onChange={handleTxtProvvValue} />
            {/*<TextField type="text" label="provvigione" labelHidden value={provvValue} onChange={() => 0} />*/}
          </Stack.Item><Stack.Item>
            <p>%</p>
          </Stack.Item>


        </Stack>
      );
    });

    return (
      <ul>
        {branches}
      </ul>);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProvv, txtProvv]);

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="Le provvigioni sono state aggiornate con successo." onDismiss={toggleActive} />
  ) : null;

  const saveErrorMarkup = saveError && (
    <Layout.Section>
      <Banner
        title="Si è verificato un errore nel salvataggio dei dati"
        status="critical"
        onDismiss={() => setSaveError(false)}
      >
        <p>Si è pregati di riprovare più tardi.</p>
      </Banner>
    </Layout.Section>
  )

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      breadcrumbs={[{ content: 'Companies', url: '/settings/companies' }]}
      title={company.company_name}
      pagination={{
        nextUrl: '',
        previousURL: ''
      }}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}

        <Layout.Section>
          <Card title="Elenco rami compagnia">
            <Card.Section>
              <Stack>
                <Heading>
                </Heading>
                <div>
                  {allBranches()}
                </div>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page >
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

  // ---- Error ----
  const errorPageMarkup = (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="Nessuna compagnia presente a questo indirizzo"
              image="https://cdn.shopify.com/shopifycloud/web/assets/v1/08f1b23a19257042c52beca099d900b0.svg"
            >
              <p>
                Controlla l'URL e riprova oppure usa la barra di ricerca per trovare ciò di cui hai bisogno.
              </p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : (error ? errorPageMarkup : actualPageMarkup);

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