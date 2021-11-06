import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Autocomplete,
  Button,
  Card,
  ContextualSaveBar,
  DatePicker,
  FormLayout,
  Frame,
  Icon,
  Layout,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TextField,
  Toast,
  Banner
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import './ProductNew.scss';
import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

export function ProductNew({ user, location }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [saveError, setSaveError] = useState(false);

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

  /**
   * Company States
   */
  const [company, setCompany] = useState({});
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);

  /**
   * Customer States
   */
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState((location.state && location.state.customer) ? location.state.customer : '');

  /**
   * Status
   */
  const [selectedStatus, setSelectedStatus] = useState('in vigore');

  const statusOptions = [
    { label: 'In vigore', value: 'in vigore' },
    { label: 'Disdettata', value: 'disdettata' },
    { label: 'Annullata', value: 'annullata' },
    { label: 'Sostituita', value: 'sostituita' },
    { label: 'Agli atti legali', value: 'agli atti legali' },
  ];

  /**
   * Policy States
   */
  const [numeroPolizza, setNumeroPolizza] = useState('');
  const [branchType, setBranchType] = useState('0');

  const [monthCreated, setMonthCreated] = useState(new Date().getMonth());
  const [yearCreated, setYearCreated] = useState(new Date().getFullYear());
  const [dateCreatedSelection, setDateCreatedSelection] = useState(false);
  const [selectedDatesCreated, setSelectedDatesCreated] = useState({ start: new Date(), end: new Date() });

  const [monthExpired, setMonthExpired] = useState(new Date().getMonth());
  const [yearExpired, setYearExpired] = useState(new Date().getFullYear());
  const [dateExpiredSelection, setDateExpiredSelection] = useState(false);
  const [selectedDatesExpired, setSelectedDatesExpired] = useState({ start: new Date(), end: new Date() });

  const [paymentTime, setPaymentTime] = useState('12');

  const [premioNetto, setPremioNetto] = useState(0);
  const [premioLordo, setPremioLordo] = useState('0,00');

  const [provvTot, setProvvTot] = useState(0);

  const handleDiscard = useCallback(() => {
    setCustomerName('');
    setIsDirty(false);
  }, []);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/products/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // @ts-ignore
          company_id: company.company_id,
          customer_id: customerId,
          numero_polizza: numeroPolizza,
          branch_id: Number(branchType),
          selected_dates_created: selectedDatesCreated.start,
          selected_dates_expired: selectedDatesExpired.start,
          payment_time: paymentTime,
          premio_netto: premioNetto,
          premio_lordo: premioLordo,
          provv_tot: provvTot,
          status: selectedStatus
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setTimeout(() => {
          history.push(`/products/${response.data._id}`);
        }, 3000);
        setIsDirty(false);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, customerId, numeroPolizza, branchType, selectedDatesCreated, selectedDatesExpired, paymentTime, premioNetto, provvTot, selectedStatus]);

  /**
   * Company Handlers
   */
  const handleCompanyChange = useCallback((id) => {
    setCompany(companies[+id - 1]);
    //@ts-ignore
    setBranches(companies[+id - 1].branches.map((branch: any) => ({ label: branch.branch_name, value: String(branch.branch_id), provv: branch.provv })));
    setBranchType('0');
    // Set default provvTot value
    // @ts-ignore
    handleProvvTotChange(companies[+id - 1].branches[0].provv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies]);


  /**
   * Customer Handlers
   */
  const handleCustomerNameChange = useCallback((e) => {
    setCustomerName(e);
  }, []);
  const handleCustomerIdChange = useCallback((e) => {
    setCustomerId(e);
  }, []);

  /**
   * Policy Handlers
   */
  const handleProvvTotChange = useCallback((e) => {
    setProvvTot(e);
    // const num: number = (+provvTot) + (+1 * +100) - (+e);
    setPremioLordo((Number(e / 100) * Number(premioNetto) + Number(premioNetto)).toString());
    // setProvvAtt(num);
  }, [premioNetto]);

  const handleNumeroPolizzaChange = useCallback((e) => {
    setNumeroPolizza(e);
  }, []);
  const handleBranchTypeChange = useCallback((e) => {
    setBranchType(e);
    //@ts-ignore
    handleProvvTotChange(branches[e].provv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches, handleProvvTotChange]);

  const handleMonthCreatedChange = useCallback((month: number, year: number) => {
    setMonthCreated(month);
    setYearCreated(year);
  }, [{ monthCreated, yearCreated }]);
  const handleDateCreatedSelection = useCallback(() => {
    setDateCreatedSelection(true);
  }, []);
  const handleSelectedDatesCreated = useCallback((e) => {
    setSelectedDatesCreated(e);
    if (dateCreatedSelection)
      setDateCreatedSelection(false);
  }, [dateCreatedSelection]);

  const handleMonthExpiredChange = useCallback((month: number, year: number) => {
    setMonthExpired(month);
    setYearExpired(year);
  }, [{ monthExpired, yearExpired }]);
  const handleDateExpiredSelection = useCallback(() => {
    setDateExpiredSelection(true);
  }, []);
  const handleSelectedDatesExpired = useCallback((e) => {
    setSelectedDatesExpired(e);
    if (dateExpiredSelection)
      setDateExpiredSelection(false);
  }, [dateExpiredSelection]);

  const handlePaymentTimeChange = useCallback((e) => {
    setPaymentTime(e);
  }, []);

  const handlePremioNettoChange = useCallback((e) => {
    setPremioNetto(e);
    setPremioLordo((Number(e) + Number(e) * Number(provvTot / 100)).toString());
  }, [provvTot]);
  const handlePremioLordoChange = useCallback((e) => {
    setPremioLordo(e);
  }, []);

  const handleSelectChange = useCallback((e) => {
    setSelectedStatus(e);
  }, []);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message={"Modifiche non salvate"}
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

  /**
   * Insurance Payment Time Options
   */
  const paymentTimeOptions = [
    { label: 'Mensile', value: '1' },
    { label: 'Bimestrale', value: '2' },
    { label: 'Trimestrale', value: '3' },
    { label: 'Quadrimestrale', value: '4' },
    { label: 'Semestrale', value: '6' },
    { label: 'Annuale', value: '12' },
  ]

  /**
   * Search client
   */
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState((location.state && location.state.customerName) ? location.state.customerName : '');
  const [deselectedOptions, setDeselectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  /**
   * Search company
   */
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  const [inputValueCompany, setInputValueCompany] = useState('');
  const [deselectedOptionsCompany, setDeselectedOptionsCompany] = useState([]);
  const [optionsCompany, setOptionsCompany] = useState([]);


  /**
   * Fetch data
   * - Fetch customers
   * - Fetch Companies
   */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/customers', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          let tmp = [];
          for (const item of response.data) {
            tmp.push({ value: item._id, label: item.name });
          }
          // @ts-ignore
          setDeselectedOptions(tmp);
          // @ts-ignore
          setOptions(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        //@ts-ignore
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/users/${user.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {

          const tmp = response.data.provv_matrix;
          setCompanies(tmp);
          let opTmp = [];
          for (const item of tmp) {
            opTmp.push({ value: item.company_id, label: item.company_name });
          }
          // @ts-ignore
          setDeselectedOptionsCompany(opTmp);
          // @ts-ignore
          setOptionsCompany(opTmp);


          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchCompanies();
    fetchClients();
  }, [user.id])

  /**
   * Autocomplete Controls
   */
  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) => {
        // @ts-ignore
        option.label.match(filterRegex)
      });
      setOptions(resultOptions);
    },
    [deselectedOptions],
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem: any) => {
        const matchedOption = options.find((option) => {
          // @ts-ignore
          return option.value.match(selectedItem);
        });
        // @ts-ignore
        return matchedOption;
      });
      setSelectedOptions(selected);
      setInputValue(selectedValue[0].label);
      handleCustomerNameChange(selected);
      handleCustomerIdChange(selectedValue[0].value);
    },
    [handleCustomerIdChange, handleCustomerNameChange, options],
  );

  const updateTextCompany = useCallback(
    (value) => {
      setInputValueCompany(value);

      if (value === '') {
        setOptionsCompany(deselectedOptionsCompany);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) => {
        // @ts-ignore
        option.label.match(filterRegex)
      });
      setOptionsCompany(resultOptions);
    },
    [deselectedOptions, deselectedOptionsCompany],
  );

  const updateSelectionCompany = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem: any) => {
        const matchedOption = optionsCompany.find((option) => {
          // @ts-ignore
          if (option.value == selectedItem)
            return option;
        });
        // @ts-ignore
        return matchedOption;
      });
      setSelectedOptionsCompany(selected);
      setInputValueCompany(selectedValue[0].label);
      handleCompanyChange(selectedValue[0].value);
    },
    [handleCompanyChange, optionsCompany],
  );

  const customerTextField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Cliente"
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Cerca"
    />
  );

  const companyTextField = (
    <Autocomplete.TextField
      onChange={updateTextCompany}
      label="Compagnia"
      value={inputValueCompany}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Cerca"
    />
  );

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="La polizza è stata creata con successo." onDismiss={toggleActive} />
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

  /**
   * Rata Component
   */
  const rataForm = (
    <Layout.AnnotatedSection
      title="Rata"
    >
      <Card sectioned>
        <FormLayout>
          <FormLayout.Group>
            <Select label="Tipologia Rata" options={paymentTimeOptions} onChange={handlePaymentTimeChange} value={paymentTime} />
          </FormLayout.Group>
        </FormLayout>
      </Card>
    </Layout.AnnotatedSection>);

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Polizza'
      breadcrumbs={[{ content: 'Polizze', url: '/products' }]}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}

        {/* Panoramica Compagnia */}
        <Layout.AnnotatedSection
          title="Dettagli Compagnia"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <Autocomplete
                  options={optionsCompany}
                  selected={selectedOptionsCompany}
                  onSelect={updateSelectionCompany}
                  textField={companyTextField}
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>

        {/* Panoramica cliente */}
        <Layout.AnnotatedSection
          title="Dettagli cliente"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <Autocomplete
                  options={options}
                  selected={selectedOptions}
                  onSelect={updateSelection}
                  textField={customerTextField}
                />
              </FormLayout.Group>
              {/*<FormLayout.Group>
                <TextField type="text" disabled={true} label="Nominativo Cliente" value={customerName} />
              </FormLayout.Group>*/}
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
        {/* Dettagli Polizza */}
        <Layout.AnnotatedSection
          title="Dettagli Polizza"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField type="text" label="Numero Polizza" value={numeroPolizza} onChange={handleNumeroPolizzaChange} />
              </FormLayout.Group>

              <FormLayout.Group>
                <Select label="Ramo Polizza" options={branches} onChange={handleBranchTypeChange} value={branchType} />
              </FormLayout.Group>

              <FormLayout.Group>
                <TextField type="text" disabled={true} labelHidden={true} label="Data di Inizio" value={selectedDatesCreated.start.toLocaleDateString()} />
                <Button onClick={handleDateCreatedSelection}>Seleziona Data di Decorrenza Polizza</Button>
              </FormLayout.Group>
              <FormLayout.Group>
                {dateCreatedSelection && <DatePicker month={monthCreated} year={yearCreated} onChange={handleSelectedDatesCreated} onMonthChange={handleMonthCreatedChange}
                  selected={selectedDatesCreated} allowRange={false} weekStartsOn={1} />}
              </FormLayout.Group>

              <FormLayout.Group>
                <TextField type="text" disabled={true} labelHidden={true} label="Data di Scadenza" value={selectedDatesExpired.start.toLocaleDateString()} />
                <Button onClick={handleDateExpiredSelection}>Seleziona Data di Scadenza Polizza</Button>
              </FormLayout.Group>
              <FormLayout.Group>
                {dateExpiredSelection && <DatePicker month={monthExpired} year={yearExpired} onChange={handleSelectedDatesExpired} onMonthChange={handleMonthExpiredChange}
                  selected={selectedDatesExpired} allowRange={false} weekStartsOn={1} />}
              </FormLayout.Group>



            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
        {/* Calcolo Premio */}
        <Layout.AnnotatedSection
          title="Calcolo Premio"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  type="text"
                  label="Premio Netto (in €)"
                  value={premioNetto.toString()}
                  onChange={handlePremioNettoChange}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                {premioNetto !== 0 &&
                  <TextField
                    type="text"
                    label="Premio Lordo (in €)"
                    value={premioLordo.toString()}
                    placeholder="0,00"
                    onChange={handlePremioLordoChange}
                    suffix="€"
                  />
                }
              </FormLayout.Group>
              {premioNetto !== 0 &&
                <FormLayout.Group>
                  <TextField type="text" label="Provvigioni (in %)" value={provvTot.toString()} onChange={handleProvvTotChange} />
                  <TextField type="number" label="Valore Provvigioni (in €)" disabled={true} value={(+premioNetto * (+provvTot / 100)).toFixed(2)} />
                </FormLayout.Group>
              }
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>

        {/* Status */}
        <Layout.AnnotatedSection
          title="Stato"
        >
          <Card sectioned>
            <Select
              label="Stato"
              options={statusOptions}
              onChange={handleSelectChange}
              value={selectedStatus}
            />
          </Card>
        </Layout.AnnotatedSection>

        {premioNetto !== 0 && rataForm}

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

