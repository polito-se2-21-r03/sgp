// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';

import {
  Avatar,
  Button,
  Card,
  EmptyState,
  DropZone,
  Caption,
  OptionList,
  Modal,
  FormLayout,
  TextField,
  Frame,
  Heading,
  Labelled,
  Layout,
  Link,
  Loading,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Stack,
  Subheading,
  TextContainer,
  TextStyle,
  Tooltip,
  Select,
  Banner,
  Toast,
  Badge
} from '@shopify/polaris';

import {
  ClipboardMinor, DeleteMinor
} from '@shopify/polaris-icons';

import { TopBarMarkup, NavigationMarkup } from '../../../components';
import { parseDateLabel } from '../../../utils/Common';

import { useHistory } from 'react-router';

export function OrderDetails({ match, user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const [modalEmailActive, setModalEmailActive] = useState(false);
  const [modalPhoneActive, setModalPhoneActive] = useState(false);
  const [modalAddressActive, setModalAddressActive] = useState(false);

  const handleModalEmailChange = useCallback(() => {
    setModalEmailActive(!modalEmailActive);
  }, [modalEmailActive]);
  const handleModalPhoneChange = useCallback(() => {
    setModalPhoneActive(!modalPhoneActive);
  }, [modalPhoneActive]);
  const handleModalAddressChange = useCallback(() => {
    setModalAddressActive(!modalAddressActive);
  }, [modalAddressActive]);

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [update, setUpdate] = useState(false);

  const loadingMarkup = isLoading ? <Loading /> : null;

  /**
   * Customer details
   */
  const [customer, setCustomer] = useState({});
  const [job, setJob] = useState('');
  const [polizze, setPolizze] = useState([]);
  const [error, setError] = useState(false);

  // Valid options for email, phone and address
  const selectOptions = [
    { label: 'Casa', value: 'Casa' },
    { label: 'Ufficio', value: 'Ufficio' },
    { label: 'Personale', value: 'Personale' },
  ];

  const [txtEmailValue, setTxtEmailValue] = useState('');
  const [emailType, setEmailType] = useState('Casa');

  const [txtPhoneValue, setTxtPhoneValue] = useState('');
  const [phoneType, setPhoneType] = useState('Casa');

  const [txtAddressValue, setTxtAddressValue] = useState('');
  const [txtCityValue, setTxtCityValue] = useState('');
  const [txtPostalCodeValue, setTxtPostalCodeValue] = useState('');
  const [addressType, setAddressType] = useState('Casa');

  //UPLOAD HANDLERS
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

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          setCustomer(response.data.customer);

          // Prev and next url
          setPrevUrl(response.data.prevUrl);
          setNextUrl(response.data.nextUrl);

          let temp = [];
          let secondTemp = [];

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

          if (response.data.deadlines !== null) {
            setPolizze(response.data.deadlines);
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setError(true);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setError(true);
      }
    }
    const fetchJob = async () => {
      try {
        if (customer.job) {
          setIsLoading(true);
          const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/jobs/${customer.job}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          const response = await data.json();

          if (response.status === 'success') {
            setJob(response.data.label);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setError(true);
          }
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setError(true);
      }
    }
    fetchCustomer();
    fetchJob();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, customer.job, match.params.id])

  /**
   * Update
   */
  const [modalActive, setModalActive] = useState(false);
  const [name, setName] = useState('');
  const [cf, setCF] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [buttonSpinning, setButtonSpinning] = useState(false);
  const [active, setActive] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleModalChange = useCallback(() => {
    setModalActive(!modalActive);
  }, [modalActive]);

  const handleNameChange = useCallback((e) => {
    setName(e);
    setIsDirty(true);
  }, []);

  const handleCFChange = useCallback((e) => {
    setCF(e);
    setIsDirty(true);
  }, []);

  const handleClose = useCallback(() => {
    handleModalChange();
    setName('');
  }, [handleModalChange]);

  /**
   * Update customer 
   */
  const handleSave = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          cf: cf
        })
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        setActive(true);
        setUpdate(!update);
      } else {
        handleClose();
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      handleClose();
      setSaveError(true);
    }
    setIsDirty(false);
    handleClose();
  }, [cf, handleClose, match.params.id, name, update]);

  /**
   * Add customer email
   */
  const handleAddEmail = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/email`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: txtEmailValue,
          email_type: emailType
        })
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    handleModalEmailChange();
  }, [emailType, handleModalEmailChange, match.params.id, txtEmailValue, update]);

  /**
  * Remove customer email
  */
  const handleRemoveEmail = useCallback(async (index) => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/email`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          index: index
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
  }, [match.params.id, update]);

  /**
   * Add customer phone
   */
  const handleAddPhone = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/phone`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: txtPhoneValue,
          phone_type: phoneType
        })
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    handleModalPhoneChange();
  }, [handleModalPhoneChange, match.params.id, phoneType, txtPhoneValue, update]);

  /**
  * Remove customer phone
  */
  const handleRemovePhone = useCallback(async (index) => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/phone`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          index: index
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
  }, [match.params.id, update]);

  /**
   * Add customer address
   */
  const handleAddAddress = useCallback(async () => {
    try {
      setButtonSpinning(true);
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/address`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: txtCityValue,
          address: txtAddressValue,
          postal_code: txtPostalCodeValue,
          address_type: addressType
        })
      })
      const response = await data.json();
      setButtonSpinning(false);

      if (response.status === 'success') {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
    handleModalAddressChange();
  }, [addressType, handleModalAddressChange, match.params.id, txtAddressValue, txtCityValue, txtPostalCodeValue, update]);

  /**
  * Remove customer address
  */
  const handleRemoveAddress = useCallback(async (index) => {
    try {
      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/address`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          index: index
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setUpdate(!update);
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
      setSaveError(true);
    }
  }, [match.params.id, update]);

  /**
   * Functions
   */
  const allEmails = useCallback(() => {
    const emails = customer.email.map((email, index) => {
      return (
        <Stack key={customer.email.indexOf(email)} distribution="equalSpacing" spacing="extraTight">
          <div>
            <Button
              plain
              url={'mailto:' + email.address}
            >
              {email.address + " - " + email.email_type}
            </Button>
          </div>
          <div>
            <Tooltip content="Copia email" dismissOnMouseOut>
              <Button
                plain
                icon={ClipboardMinor}
                onClick={() => {
                  navigator.clipboard.writeText(email.address);
                }}
              />
            </Tooltip>
            <Tooltip content="Elimina email" dismissOnMouseOut>
              <Button
                plain
                icon={DeleteMinor}
                onClick={() => handleRemoveEmail(index)}
              />
            </Tooltip>
          </div>
        </Stack>
      )
    });

    return emails;
  }, [customer.email, handleRemoveEmail]);

  const allPhones = useCallback(() => {
    const phones = customer.phone.map((phone, index) => {
      return (
        <Stack key={customer.phone.indexOf(phone)} distribution="equalSpacing" spacing="extraTight">
          <div>
            <Button
              plain
              url={'tel:' + phone.number}
            >
              {phone.number + " - " + phone.phone_type}
            </Button>
          </div>
          <div>
            <Tooltip content="Copia numero" dismissOnMouseOut>
              <Button
                plain
                icon={ClipboardMinor}
                onClick={() => {
                  navigator.clipboard.writeText(phone.number);
                }}
              />
            </Tooltip>
            <Tooltip content="Elimina numero" dismissOnMouseOut>
              <Button
                plain
                icon={DeleteMinor}
                onClick={() => handleRemovePhone(index)}
              />
            </Tooltip>
          </div>
        </Stack>
      )
    });

    return phones;
  }, [customer.phone, handleRemovePhone]);

  const allAddresses = useCallback(() => {
    const addresses = customer.address.map((address, index) => {
      const tmp = address.line + ", " + address.city + ", " + address.postal_code + ", - " + address.address_type;
      return (
        <Stack key={customer.address.indexOf(address)} distribution="equalSpacing" spacing="extraTight">
          <div>
            {tmp}
          </div>
          <div>
            <Tooltip content="Copia indirizzo" dismissOnMouseOut>
              <Button
                plain
                icon={ClipboardMinor}
                onClick={() => {
                  navigator.clipboard.writeText(address.line + ", " + address.city + ", " + address.postal_code);
                }}
              />
            </Tooltip>
            <Tooltip content="Elimina indirizzo" dismissOnMouseOut>
              <Button
                plain
                icon={DeleteMinor}
                onClick={() => handleRemoveAddress(index)}
              />
            </Tooltip>
          </div>
        </Stack>
      )
    });

    return addresses;
  }, [customer.address, handleRemoveAddress]);

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

        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/upload`, {
          method: 'POST',
          credentials: 'include',
          body: fd
        })
        const response = await data.json();

      } catch (error) {
        console.log(error);
        setError(true);
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
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : `/api`) + `/customers/${match.params.id}/files/${btoa(fileKey)}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const response = await data.json();

      } catch (error) {
        console.log(error);
        setError(true);
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
      setError(true);
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
   * Modals markup
   */
  const modalMarkup = modalActive && (
    <Modal
      open={modalActive}
      onClose={handleClose}
      title="Modifica cliente"
      primaryAction={{
        content: 'Salva',
        onAction: handleSave,
        disabled: !isDirty,
        loading: buttonSpinning
      }}
      secondaryActions={[
        {
          content: 'Annulla',
          onAction: handleClose,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <FormLayout.Group>
            <TextField type="text" label="Nome" value={name} onChange={handleNameChange} />
          </FormLayout.Group>
          <FormLayout.Group>
            <TextField type="text" label="Codice Fiscale" value={cf} onChange={handleCFChange} />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  const modalEmailMarkup = modalEmailActive && (
    <Modal
      open={modalEmailActive}
      onClose={handleModalEmailChange}
      title={'Aggiungi email'}
      primaryAction={{
        content: 'Aggiungi',
        onAction: handleAddEmail,
        loading: buttonSpinning
      }}
      secondaryActions={[
        {
          content: 'Rimuovi',
          onAction: handleModalEmailChange,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <FormLayout.Group>
            <TextField type="email" label="Indirizzo email" value={txtEmailValue} onChange={(e) => setTxtEmailValue(e)} />
          </FormLayout.Group>
          <FormLayout.Group>
            <Select
              label="Tipologia"
              options={selectOptions}
              onChange={(e) => setEmailType(e)}
              value={emailType}
            />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  const modalPhoneMarkup = modalPhoneActive && (
    <Modal
      open={modalPhoneActive}
      onClose={handleModalPhoneChange}
      title={'Aggiungi numero di telefono'}
      primaryAction={{
        content: 'Aggiungi',
        onAction: handleAddPhone,
        loading: buttonSpinning
      }}
      secondaryActions={[
        {
          content: 'Rimuovi',
          onAction: handleModalPhoneChange,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <FormLayout.Group>
            <TextField type="tel" label="Numero di telefono" value={txtPhoneValue} onChange={(e) => setTxtPhoneValue(e)} />
          </FormLayout.Group>
          <FormLayout.Group>
            <Select
              label="Tipologia"
              options={selectOptions}
              onChange={(e) => setPhoneType(e)}
              value={phoneType}
            />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  const modalAddressMarkup = modalAddressActive && (
    <Modal
      open={modalAddressActive}
      onClose={handleModalAddressChange}
      title={'Aggiungi indirizzo'}
      primaryAction={{
        content: 'Aggiungi',
        onAction: handleAddAddress,
        loading: buttonSpinning
      }}
      secondaryActions={[
        {
          content: 'Rimuovi',
          onAction: handleModalAddressChange,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <FormLayout.Group>
            <TextField type="text" label="Indirizzo" value={txtAddressValue} onChange={(e) => setTxtAddressValue(e)} />
          </FormLayout.Group>
          <FormLayout.Group>
            <TextField type="text" label="Città" value={txtCityValue} onChange={(e) => setTxtCityValue(e)} />
            <TextField type="text" label="Codice Postale" value={txtPostalCodeValue} onChange={(e) => setTxtPostalCodeValue(e)} />
          </FormLayout.Group>
          <FormLayout.Group>
            <Select
              label="Tipologia"
              options={selectOptions}
              onChange={(e) => setAddressType(e)}
              value={addressType}
            />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  /** 
   * Polizze markup
   */
  const polizzeList = [];
  for (const [i, item] of polizze.entries()) {
    const classNames = (new Date(item.date_scadenza) < new Date())
      ? 'polizzeSectionBlock error' : 'polizzeSectionBlock';
    polizzeList.push(
      <div key={i} className={classNames}>
        <Link removeUnderline url={`/products/${item._id}`}>
          <div>
            <div className="polizzeSectionSubheading ">
              <Subheading>{parseDateLabel(new Date(item.date_scadenza))}</Subheading>
            </div>
            <ul className="polizzeSectionUl">
              <li className="polizzeSectionLi">
                <div className="polizzeSectionMargin">
                  <div className="polizzeSectionText">
                    <div className="polizzeSectionPoint"></div>
                    <p className="polizzeSectionP">{item.numero_polizza}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Link>
      </div>
    )
  };

  const polizzeMarkup = (
    <>
      {/** Polizze */}
      <div className="polizzeSectionHeading">
        <Heading>Polizze</Heading>
      </div>
      <div>
        <div className="polizzeSectionInitial">
          <div className="polizzeSectionAvatar">
            <Avatar customer={false} size="medium" initials={'C'} name={'_id'} />
          </div>
        </div>
        <div>
          {polizzeList}
        </div>
      </div>
    </>
  )

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="I dati sono stati aggiornati con successo." onDismiss={toggleActive} />
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
      breadcrumbs={[{ content: 'Customer', url: '/customers' }]}
      title={customer.name}
      pagination={{
        hasNext: nextUrl && true,
        hasPrevious: prevUrl && true,
        nextURL: nextUrl && `/customers/${nextUrl}`,
        previousURL: prevUrl && `/customers/${prevUrl}`
      }}
      secondaryActions={[{
        content: 'Modifica',
        onAction: handleModalChange
      },
      {
        content: 'Crea preventivo',
        onAction: () => {
          history.push({
            pathname: '/quotes/new',
            state: {
              customer: customer._id,
              customerName: customer.name
            }
          })
        }
      },
      {
        content: 'Crea polizza',
        onAction: () => {
          history.push({
            pathname: '/products/new',
            state: {
              customer: customer._id,
              customerName: customer.name
            }
          })
        }
      }]}
    >
      <Layout>
        <Layout.Section>
          <Card title="Dettagli cliente">
            <Card.Section>
              <Stack>
                <Heading>
                  <Avatar customer={false} size="medium" name={'_id'} />
                </Heading>
                <div>
                  <h3>
                    <TextStyle variation="strong">{customer.name}</TextStyle>
                  </h3>
                  <p>
                    {customer.type === 'private' ? (
                      <TextStyle variation="subdued">Professione: {job ? job : (<Badge>Mancante</Badge>)}</TextStyle>
                    ) : (
                      <TextStyle variation="subdued">ATECO: {customer.ateco ? customer.ateco : (<Badge>Mancante</Badge>)}</TextStyle>
                    )}
                  </p>
                  <p>
                    <TextStyle variation="subdued">CF: {customer.cf ? customer.cf : (<Badge>Mancante</Badge>)}</TextStyle>
                  </p>
                  <p>
                    <TextStyle variation="subdued">{(customer.address && customer.address.length > 0) && customer.address[0].line + ', ' + customer.address[0].city + ', ' + customer.address[0].postal_code + ', ' + customer.address[0].country + ' - ' + customer.address[0].address_type}</TextStyle>
                  </p>
                </div>
              </Stack>
              <br />
              {customer.note ? (
                <div className="notaContainer">
                  <Stack>
                    <Labelled>Note sul cliente:</Labelled>
                    <p>{customer.note}</p>
                  </Stack>
                </div>
              ) : ''}
            </Card.Section>
          </Card>
          {/** Polizze Markup */}
          {polizze.length > 0 ? (
            <div className="polizzeMarkup">
              {polizzeMarkup}
            </div>
          ) : null}
          <Card title="Documenti vari">
            <Card.Section>
              {fileUploadJSX}
            </Card.Section>
          </Card>
        </Layout.Section>


        { /** Second column */}
        <Layout.Section secondary>
          <Card
            title="Email"
            actions={[
              {
                content: 'Aggiungi',
                onAction: handleModalEmailChange
              }
            ]}
          >
            <Card.Section>
              <Stack vertical>
                {customer.email && allEmails()}
              </Stack>
            </Card.Section>
          </Card>
          <Card
            title="Numeri di telefono"
            actions={[
              {
                content: 'Aggiungi',
                onAction: handleModalPhoneChange
              }
            ]}
          >
            <Card.Section>
              <Stack vertical>
                {customer.phone && allPhones()}
              </Stack>
            </Card.Section>
          </Card>
          <Card
            title="Indirizzi"
            actions={[
              {
                content: 'Aggiungi',
                onAction: handleModalAddressChange
              }
            ]}
          >
            <Card.Section>
              <Stack vertical>
                {customer.phone ? (
                  <Stack distribution="equalSpacing" spacing="extraTight">
                    <div>
                      {allAddresses()}
                    </div>
                  </Stack>
                ) : ''}
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div className="polizzeSection">
            {polizze.length > 0 ? polizzeMarkup : ''}
          </div>
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
              heading="An order with this address does not exist"
              image="https://cdn.shopify.com/shopifycloud/web/assets/v1/08f1b23a19257042c52beca099d900b0.svg"
            >
              <p>
                Check the URL and try again.
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
      {loadingMarkup}
      {pageMarkup}
      {modalMarkup}
      {modalEmailMarkup}
      {modalPhoneMarkup}
      {modalAddressMarkup}
      {toastMarkup}
      {saveErrorMarkup}
    </Frame>
  );
}