// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';

import {
  Autocomplete,
  Banner,
  Button,
  Card,
  ContextualSaveBar,
  DatePicker,
  FormLayout,
  Frame,
  Icon,
  Layout,
  Link,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Stack,
  TextContainer,
  TextField,
  DropZone,
  Caption,
  OptionList,
  Modal,
  Toast,
  Badge,
  EmptyState
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup } from '../../../components';

import './ProductDetails.scss';
import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

export function ProductDetails({ match, user, vcDate, setVcDate }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [replaceModalActive, setReplaceModalActive] = useState(false);
  const [active, setActive] = useState(false);
  const [replaceActive, setReplaceActive] = useState(false);
  const [uploadActive, setUploadActive] = useState(false);
  const [deleteActive, setDeleteActive] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toggleReplaceActive = useCallback(() => setReplaceActive((replaceActive) => !replaceActive), [])
  const toggleUploadActive = useCallback(() => setUploadActive((uploadActive) => !uploadActive), []);
  const toggleDeleteActive = useCallback(() => setDeleteActive((deleteActive) => !deleteActive), []);

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

  const handleReplaceModalChange = useCallback(() => setReplaceModalActive(!replaceModalActive), [replaceModalActive]);

  /**
   * Company States
   */
  const [company, setCompany] = useState({});
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);

  /**
   * Search company
   */
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  const [inputValueCompany, setInputValueCompany] = useState('');
  const [deselectedOptionsCompany, setDeselectedOptionsCompany] = useState([]);
  const [optionsCompany, setOptionsCompany] = useState([]);

  /**
   * Customer States
   */
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  /**
   * Search client
   */
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [deselectedOptions, setDeselectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

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
  const [newPolicy, setNewPolicy] = useState('');

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
  const [provvPass, setProvvPass] = useState(0);

  /**
   * File Upload - Documenti
   */
  const [files, setFiles] = useState([]);
  const [fileID, setFileID] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [txtFileUploadValue, setTxtFileUploadValue] = useState('');
  const [tmpFileUploadValue, setTmpFileUploadValue] = useState();
  const [selectedFileUpload, setSelectedFileUpload] = useState([]);
  const [optionsFileUpload, setOptionsFileUpload] = useState([]);
  const [activeFileUpload, setActiveFileUpload] = useState(false);
  const [isAdderFileUpload, setIsAdderFileUpload] = useState(false);
  const [selectedType, setSelectedType] = useState('0')

  const typeOptions = [
    { label: 'Documento di identità', value: '0' },
    { label: 'Altro', value: '1' },
  ];

  const [fileTypes, setFileTypes] = useState([]);


  const [defaultState, setDefaultState] = useState({
    dealer_id: '',
    customer_id: '',
    numero_polizza: '',
    branch_type: '',
    selected_dates_created: {
      start: new Date(),
      end: new Date()
    },
    selected_dates_expired: {
      start: new Date(),
      end: new Date()
    },
    payment_time: '12',
    premio_netto: '',
    accessori: '',
    tasse: '',
    provv_tot: '',
    provv_pass: '',
    provv_att: '',
    ritenuta_acconto: '',

    wasReturnedSigned: false,
    selectedDatesProRata: {
      start: new Date(),
      end: new Date()
    },
    premioNettoProRata: 0,
    thereIsProRata: false
  })

  const handleDiscard = useCallback(() => {
    setCustomerName('');
    setIsDirty(false);
  }, []);


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
   * Data fetching:
   * - fetch products
   * - fetch companies
   */
  useEffect(() => {
    let companyValue = 0;
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/products/${match.params.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          const struct = response.data;
          setDefaultState({
            dealer_id: struct.product.dealer_id,
            customer_id: struct.product.customer_id,
            numero_polizza: struct.product.numero_polizza,
            branch_type: struct.product.branch_id,
            selected_dates_created: {
              start: new Date(struct.product.date_created),
              end: new Date(struct.product.date_created),
            },
            selected_dates_expired: {
              start: new Date(struct.product.date_scadenza),
              end: new Date(struct.product.date_scadenza),
            },
            payment_time: struct.product.payment_time,
            premio_netto: struct.product.premio_netto,
            premio_lordo: struct.product.premio_lordo,
            provv_tot: struct.product.provvtotali,
            selectedDatesProRata: {
              start: new Date(struct.product.date_pro_rata),
              end: new Date(struct.product.date_pro_rata),
            },
          })

          struct.product.new_product_id && setNewPolicy(struct.product.new_product_id);
          setCustomerId(struct.product.customer_id);
          setNumeroPolizza(struct.product.numero_polizza);
          setBranchType(struct.product.branch_id);
          setPremioNetto(struct.product.premio_netto);
          setPremioLordo(struct.product.premio_lordo);
          setProvvTot(struct.product.provvtotali);
          setPaymentTime(paymentTime => struct.product.payment_time);
          setSelectedDatesCreated({
            start: new Date(struct.product.date_created),
            end: new Date(struct.product.date_created),
          });
          setSelectedDatesExpired({
            start: new Date(struct.product.date_scadenza),
            end: new Date(struct.product.date_scadenza),
          });
          setBranchType(struct.branch.value);
          setSelectedStatus(struct.product.status);

          setSelectedOptions(struct.customer._id);
          setInputValue(struct.customer.name);
          handleCustomerNameChange(struct.customer._id);
          handleCustomerIdChange(struct.customer._id);

          setInputValueCompany(struct.company.name);
          companyValue = struct.company.company_id;

          // Files
          const fileArray = [];
          const fileNamesArray = [];
          const fileIdsArray = [];
          const fileOptions = [];
          const fileTypes = [];

          for (const item of response.data.customer.files) {
            fileArray.push('Document');
            fileNamesArray.push(item.title);
            fileIdsArray.push(item._id);
            const fileName = item.title.split("__")[1];
            fileOptions.push({
              label: `${fileName} - ${typeOptions[item.file_type].label}`,
              value: item.key
            });
            fileTypes.push(item.file_type);
          }
          setFiles(fileArray);
          setFileNames(fileNamesArray);
          setFileID(fileIdsArray);
          setOptionsFileUpload(fileOptions);
          setFileTypes(fileTypes);

          setIsLoading(false);
        } else {
          setIsLoading(false);
          setLoadError(true);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setLoadError(true);
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
          setCompany(tmp[companyValue - 1]);
          setBranches(tmp[companyValue - 1].branches.map((branch: any) => ({ label: branch.branch_name, value: String(branch.branch_id), provv: branch.provv })));

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchProduct();
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCustomerIdChange, handleCustomerNameChange, match.params.id])

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/products/${match.params.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // @ts-ignore
          company_id: company.company_id,
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
      setButtonSpinning(false);

      if (response.status === 'success') {
        setActive(true);
      } else {
        console.log('err');
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id, company && company.company_id, numeroPolizza, branchType, selectedDatesCreated.start, selectedDatesExpired.start, paymentTime, premioNetto, premioLordo, provvTot, selectedStatus]);

  /**
   * Replace policy
   */
  const handleReplacePolicy = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/products/${match.params.id}/replace`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        setReplaceActive(true);
        setTimeout(() => {
          history.push(`/products/${response.data._id}`);
        }, 3000);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    setReplaceModalActive(false);
  }, [history, match.params.id]);

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
   * Policy Handlers
   */
  const handleNumeroPolizzaChange = useCallback((e) => {
    setNumeroPolizza(e);
    setIsDirty(true);
  }, []);

  const handleMonthCreatedChange = useCallback((month: number, year: number) => {
    setMonthCreated(month);
    setYearCreated(year);
    setIsDirty(true);
  }, [{ monthCreated, yearCreated }]);
  const handleDateCreatedSelection = useCallback(() => {
    setDateCreatedSelection(true);
    setIsDirty(true);
  }, []);
  const handleSelectedDatesCreated = useCallback((e) => {
    setSelectedDatesCreated(e);
    if (dateCreatedSelection)
      setDateCreatedSelection(false);
    setIsDirty(true);
  }, [dateCreatedSelection]);

  const handleMonthExpiredChange = useCallback((month: number, year: number) => {
    setMonthExpired(month);
    setYearExpired(year);
    setIsDirty(true);
  }, [{ monthExpired, yearExpired }]);
  const handleDateExpiredSelection = useCallback(() => {
    setDateExpiredSelection(true);
    setIsDirty(true);
  }, []);
  const handleSelectedDatesExpired = useCallback((e) => {
    setSelectedDatesExpired(e);
    if (dateExpiredSelection)
      setDateExpiredSelection(false);
    setIsDirty(true);
  }, [dateExpiredSelection]);

  const handlePaymentTimeChange = useCallback((e) => {
    /*if (e == '12' && premioNetto != 0) {
      setPremioNetto(+premioNetto * 2);
    }
    else if (e == '6' && premioNetto != 0) {
      setPremioNetto(+premioNetto / 2);
    }*/

    setPaymentTime(e);
    setIsDirty(true);

  }, []);

  const handlePremioNettoChange = useCallback((e) => {
    setPremioNetto(e);
    setPremioLordo((Number(e) + Number(e) * Number(provvTot / 100)).toString());
    setIsDirty(true);
  }, [provvTot]);
  const handlePremioLordoChange = useCallback((e) => {
    setPremioLordo(e);
  }, []);

  const handleProvvTotChange = useCallback((e) => {
    setProvvTot(e);
    // const num: number = (+accessori * +100) + (+e) - (+provvPass);
    setPremioLordo((Number(e / 100) * Number(premioNetto) + Number(premioNetto)).toString());
    setIsDirty(true);
  }, [premioNetto]);

  const handleBranchTypeChange = useCallback((e) => {
    setBranchType(e);
    handleProvvTotChange(branches[e].provv);
    setIsDirty(true);
  }, [branches, handleProvvTotChange]);

  const handleSelectChange = useCallback((value) => {
    setSelectedStatus(value);
    setIsDirty(true);
  }, []);

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message={"Modifiche non salvate"}
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
     * File Uploading Handler
     */
  const toggleModalFileUpload = useCallback(() => setActiveFileUpload((activeFileUpload: boolean) => !activeFileUpload), []);
  const toggleIsAdderFileUpload = useCallback((e: boolean) => {
    setIsAdderFileUpload((isAdderFileUpload) => {
      isAdderFileUpload = e;
      return isAdderFileUpload;
    });
  }, []);

  const handleFileUploadAdd = useCallback((e: any, fn: string, type: any) => {
    if (e === '' || e === undefined || fn === '' || fn === undefined || type === undefined || type === '')
      return;

    setFiles((files) => {
      const newFiles = files;
      //@ts-ignore
      newFiles.push(e);
      return newFiles;
    });

    setFileNames((fileNames) => {
      const newFileNames = fileNames;
      //@ts-ignore
      newFileNames.push(fn);
      return newFileNames;
    });

    setOptionsFileUpload((optionsFileUpload) => {
      const newOptions = optionsFileUpload;
      //@ts-ignore
      newOptions.push({ label: `${(fn.split("__")[1])} - ${typeOptions[Number(type)].label}`, value: (fn) });
      return newOptions;
    });

    const addFile = async () => {
      try {
        const fd = new FormData();
        fd.append("document", e);
        fd.append("type", type);

        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/products/${match.params.id}/upload`, {
          method: 'POST',
          credentials: 'include',
          body: fd
        })
        const response = await data.json();
        if (response.status === 'success') {
          setUploadActive(true);
        } else {
          setSaveError(true);
        }

      } catch (error) {
        console.log(error);
        setSaveError(true);
      }
    }
    addFile();
  }, [match.params.id, typeOptions]);

  const handleConfirmFileUpload = useCallback(() => {
    if (isAdderFileUpload) {
      handleFileUploadAdd(tmpFileUploadValue, txtFileUploadValue, selectedType);
    }

    else {
      handleFileUploadModify(tmpFileUploadValue, txtFileUploadValue, selectedFileUpload[0]);
    }

    toggleModalFileUpload();
  }, [isAdderFileUpload, toggleModalFileUpload, handleFileUploadAdd, tmpFileUploadValue, txtFileUploadValue, selectedType, selectedFileUpload]);

  const handleTmpFileUploadValue = useCallback((e) => {
    setTmpFileUploadValue(e);
  }, [])

  const handleAddFileUpload = useCallback((_dropFiles, acceptedFiles, _rejectedFiles) => {
    toggleModalFileUpload();
    toggleIsAdderFileUpload(true);
    let blob = acceptedFiles[0];
    const file = new File([blob], match.params.id + '__' + acceptedFiles[0].name);
    setTxtFileUploadValue(file.name);
    setTmpFileUploadValue((tmpFileUploadValue) => file);

  }, [toggleModalFileUpload, toggleIsAdderFileUpload, match.params.id]);

  const handleSelectionFileUpload = useCallback((e) => {
    setSelectedFileUpload(e);
  }, []);

  /**
   * Delete file
   */
  const handleDelFileUpload = useCallback(() => {
    if (selectedFileUpload[0] === '' || selectedFileUpload[0] === undefined)
      return;

    const modFileName = selectedFileUpload[0];
    const modFile = files[fileNames.indexOf(selectedFileUpload[0])];
    const modFileID = fileID[fileNames.indexOf(selectedFileUpload[0])];

    const delFile = async () => {
      try {
        const tmp = selectedFileUpload[0].split('/');
        let fileKey = selectedFileUpload[0];
        if (tmp.length === 1) {
          let userId = await asyncLocalStorage.getItem('user');
          userId = userId && JSON.parse(userId);
          userId = userId.id;
          fileKey = `${userId}/${fileKey}`;
        }
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/products/${match.params.id}/files/${btoa(fileKey)}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const response = await data.json();
        if (response.status === 'success') {
          setDeleteActive(true);
        } else {
          setSaveError(true);
        }

      } catch (error) {
        console.log(error);
        setSaveError(true);
      }
    }
    delFile();

    setFiles((files) => {
      //@ts-ignore
      const indexOfDeletion = files.indexOf(modFile);
      files.splice(indexOfDeletion, 1);
      return files;
    });

    setFileNames((fileNames) => {
      //@ts-ignore
      const indexOfDeletion = fileNames.indexOf(modFileName);
      fileNames.splice(indexOfDeletion, 1);
      return fileNames;
    });

    setOptionsFileUpload((optionsFileUpload) => {
      //@ts-ignore
      const indexOfDeletion = optionsFileUpload.findIndex(op => op.value === selectedFileUpload[0]);
      optionsFileUpload.splice(indexOfDeletion, 1);
      return optionsFileUpload;
    });

    setFileID((fileID) => {
      //@ts-ignore
      const indexOfDeletion = fileID.indexOf(modFileID);
      fileID.splice(indexOfDeletion, 1);
      return fileID;
    });

    handleSelectionFileUpload(['']);

  }, [selectedFileUpload, files, fileNames, fileID, handleSelectionFileUpload, match.params.id]);

  /**
   * Download single file 
   */
  const handleOpenFile = useCallback(async () => {
    try {
      const tmp = selectedFileUpload[0].split('/');
      let fileKey = selectedFileUpload[0];
      if (tmp.length === 1) {
        let userId = await asyncLocalStorage.getItem('user');
        userId = userId && JSON.parse(userId);
        userId = userId.id;
        fileKey = `${userId}/${fileKey}`;
      }
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/files/${btoa(fileKey)}`, {
        method: 'GET',
        credentials: 'include',
      })
      const response = await data.blob();

      saveAs(response, selectedFileUpload[0].split("__")[1]);

    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
  }, [selectedFileUpload]);

  const fileUpload = !tmpFileUploadValue && <DropZone.FileUpload />;
  const uploadedFile = tmpFileUploadValue && (
    <Stack>
      <div>
        {tmpFileUploadValue.name.split("__")[1]} <Caption>{tmpFileUploadValue.size} bytes</Caption>
      </div>
    </Stack>
  );

  const fileUploadJSX = (
    <div>
      <Stack vertical>
        <DropZone allowMultiple={false} onDrop={handleAddFileUpload}>
          <DropZone.FileUpload />
        </DropZone>
        <Stack distribution={'center'}>
          {selectedFileUpload[0] && <Button onClick={handleOpenFile}>Apri</Button>}
          {/*selectedFileUpload[0] && <Button onClick={handleModFileUpload}>Modifica</Button>*/}
          {selectedFileUpload[0] && <Button onClick={handleDelFileUpload}>Elimina</Button>}
        </Stack>
        <OptionList
          onChange={handleSelectionFileUpload}
          options={optionsFileUpload}
          selected={selectedFileUpload}
        />
      </Stack>

      <div>
        <Modal
          open={activeFileUpload}
          onClose={toggleModalFileUpload}
          title={isAdderFileUpload ? 'Conferma Aggiunta' : 'Conferma Modifica'}
          primaryAction={{
            content: 'Chiudi',
            onAction: toggleModalFileUpload,
          }}>
          <Modal.Section>
            <FormLayout>
              <FormLayout.Group>
                <DropZone onDrop={handleTmpFileUploadValue}>
                  {uploadedFile}
                  {fileUpload}
                </DropZone>
              </FormLayout.Group>
              <FormLayout.Group>
                <Select
                  label="Tipologia di documento"
                  options={typeOptions}
                  onChange={(e) => setSelectedType(e)}
                  value={selectedType}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <Button primary onClick={handleConfirmFileUpload}>
                  {isAdderFileUpload ? 'Conferma Aggiunta' : 'Conferma Modifica'}
                </Button>
              </FormLayout.Group>
            </FormLayout>
          </Modal.Section>
        </Modal>
      </div>
    </div>
  )

  /**
   * Autocomplete Controls
   */
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
          if (option.value === selectedItem)
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

  const companyTextField = (
    <Autocomplete.TextField autoComplete="off"
      onChange={updateTextCompany}
      label="Compagnia"
      value={inputValueCompany}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Cerca"
    />
  );

  /**
   * Replace policy modal markup
   */
  const replaceModalMarkup = (
    <Modal
      open={replaceModalActive}
      onClose={handleReplaceModalChange}
      title="Sostituzione polizza"
      primaryAction={{
        content: 'Continua',
        onAction: handleReplacePolicy,
        loading: buttonSpinning
      }}
      secondaryActions={[
        {
          content: 'Cancella',
          onAction: handleReplaceModalChange,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            Si è sicuri di voler procedere con la sostituzione della polizza?
          </p>
          <p>
            Una volta che si è proceduto non è possibile tornare indietro.
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
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
            <Select label="Tipologia Rata" options={paymentTimeOptions} onChange={handlePaymentTimeChange} value={paymentTime.toString()} />
          </FormLayout.Group>
        </FormLayout>
      </Card>
    </Layout.AnnotatedSection>);

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="I dati sono stati aggiornati con successo." onDismiss={toggleActive} />
  ) : null;

  const toastReplacedMarkup = replaceActive ? (
    <Toast content="La nuova polizza è stata creata con successo." onDismiss={toggleReplaceActive} />
  ) : null;

  const toastUploadMarkup = uploadActive ? (
    <Toast content="Il file è stato caricato con successo." onDismiss={toggleUploadActive} />
  ) : null;

  const toastDeleteMarkup = deleteActive ? (
    <Toast content="Il file è stato rimosso con successo." onDismiss={toggleDeleteActive} />
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
   * Title markup
   */
  const titleMarkup = selectedStatus === 'sostituita' && (
    <Badge status="attention" progress="complete">Sostituita</Badge>
  )

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Polizza'
      titleMetadata={titleMarkup}
      breadcrumbs={[{ content: 'Polizze', url: '/products' }]}
      primaryAction={selectedStatus !== 'sostituita' && (
        <Button
          primary
          onClick={handleReplaceModalChange}
        >
          Sostituisci polizza
        </Button>
      )}
      secondaryActions={[
        selectedStatus === 'sostituita' && {
          content: 'Vai alla nuova polizza',
          onAction: () => {
            history.push({
              pathname: `/products/${newPolicy}`,
            })
          }
        },
      ]}
    >
      <Layout>

        {/* Banner */}
        {saveErrorMarkup}

        {/* Panoramica compagnia */}
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
                <TextField autoComplete="off" type="text" disabled={true} label="Cliente" value={inputValue} />
              </FormLayout.Group>
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
                <TextField autoComplete="off" type="text" label="Numero Polizza" value={numeroPolizza} onChange={handleNumeroPolizzaChange} />
              </FormLayout.Group>

              <FormLayout.Group>
                <Select label="Ramo Polizza" options={branches} onChange={handleBranchTypeChange} value={branchType} />
              </FormLayout.Group>

              <FormLayout.Group>
                <TextField autoComplete="off" type="text" disabled={true} labelHidden={true} label="Data di Inizio" value={selectedDatesCreated.start.toLocaleDateString()} />
                <Button onClick={handleDateCreatedSelection}>Seleziona Data di Decorrenza Polizza</Button>
              </FormLayout.Group>
              <FormLayout.Group>
                {dateCreatedSelection && <DatePicker month={monthCreated} year={yearCreated} onChange={handleSelectedDatesCreated} onMonthChange={handleMonthCreatedChange}
                  selected={selectedDatesCreated} allowRange={false} weekStartsOn={1} />}
              </FormLayout.Group>

              <FormLayout.Group>
                <TextField autoComplete="off" type="text" disabled={true} labelHidden={true} label="Data di Scadenza" value={selectedDatesExpired.start.toLocaleDateString()} />
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
                <TextField autoComplete="off"
                  type="text"
                  label="Premio Netto (in €)"
                  value={premioNetto.toString()}
                  onChange={handlePremioNettoChange}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                {premioNetto !== 0 &&
                  <TextField autoComplete="off"
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
                  <TextField autoComplete="off" type="text" label="Provvigioni (in %)" value={provvTot.toString()} onChange={handleProvvTotChange} />
                  <TextField autoComplete="off" type="number" label="Valore Provvigioni (in €)" disabled={true} value={(+premioNetto * (+provvTot / 100)).toFixed(2)} />
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
              disabled={selectedStatus === 'sostituita'}
            />
          </Card>
        </Layout.AnnotatedSection>

        {provvPass !== 0 && rataForm}

        {/* Documents */}
        <Layout.AnnotatedSection
          title="Documenti"
        >
          <Card sectioned>
            {fileUploadJSX}
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

  // ---- Error ----
  const errorPageMarkup = (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="Nessun prodotto presente a questo indirizzo"
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

  const pageMarkup = isLoading ? loadingPageMarkup : (loadError ? errorPageMarkup : actualPageMarkup);

  return (
    <Frame
      topBar={
        <TopBarMarkup vcDate={vcDate} setVcDate={setVcDate} handleMobileNavigation={handleMobileNavigation} />
      }
      navigation={<NavigationMarkup user={user} />}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      skipToContentTarget={skipToContentRef}
    >
      {contextualSaveBarMarkup}
      {loadingMarkup}
      {pageMarkup}
      {replaceModalMarkup}
      {toastMarkup}
      {toastReplacedMarkup}
      {toastUploadMarkup}
      {toastDeleteMarkup}
    </Frame>
  );
}

