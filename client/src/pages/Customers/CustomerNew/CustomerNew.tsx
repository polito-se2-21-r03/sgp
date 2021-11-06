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
  TextContainer,
  TextField,
  Autocomplete,
  Icon,
  Banner,
  Toast,
} from '@shopify/polaris';

import { TopBarMarkup, NavigationMarkup, contextControlMarkup, } from '../../../components';

import './CustomerNew.scss';
import { SearchMinor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

export function CustomerNew({ user }: any) {
  const history = useHistory();

  const skipToContentRef = useRef<HTMLAnchorElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [active, setActive] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [existError, setExistError] = useState(false);
  const [validationNameError, setValidationNameError] = useState(false);
  const [validationLastnameError, setValidationLastnameError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const [firstname, setFirstname] = useState('');               //Firstname used as both first name and company name
  const [lastname, setLastname] = useState('');                 //Only used if private customer is selected
  const [cf, setCf] = useState('');
  const [piva, setPiva] = useState('');                         //Only used if company customer is selected
  const [ateco, setAteco] = useState('');                       //Only used if company customer is selected
  const [job, setJob] = useState('');

  const [email, setEmail] = useState([]);
  const [emailReference, setEmailReference] = useState([]);

  const [phone, setPhone] = useState([]);
  const [phoneReference, setPhoneReference] = useState([]);

  const [type, setType] = useState('private');                  //Can be either 'private' or 'company'
  const [address, setAddress] = useState([]);
  const [city, setCity] = useState([]);
  const [postalCode, setPostalCode] = useState([]);
  const [country, setCountry] = useState([]);                   //Value is country.code
  const [addressReference, setAddressReference] = useState([]);


  const [countryOptions, setCountryOptions] = useState([]);     //Used to load array of countries
  const [note, setNote] = useState('');

  // Valid options for email, phone and address
  const selectOptions = [
    { label: 'Casa', value: 'Casa' },
    { label: 'Ufficio', value: 'Ufficio' },
    { label: 'Personale', value: 'Personale' },
  ];

  const [txtEmailValue, setTxtEmailValue] = useState('');
  const [txtEmailReferenceValue, setTxtEmailReferenceValue] = useState('');
  const [emailType, setEmailType] = useState('Casa');
  //const [selectedEmail, setSelectedEmail] = useState([]);
  //const [optionsEmail, setOptionsEmail] = useState([]);
  //const [activeEmail, setActiveEmail] = useState(false);
  //const [isAdderEmail, setIsAdderEmail] = useState(false);

  const [txtPhoneValue, setTxtPhoneValue] = useState('');
  const [txtPhoneReferenceValue, setTxtPhoneReferenceValue] = useState('');
  const [phoneType, setPhoneType] = useState('Casa');
  const [selectedPhone, setSelectedPhone] = useState([]);
  const [optionsPhone, setOptionsPhone] = useState([]);
  const [activePhone, setActivePhone] = useState(false);
  const [isAdderPhone, setIsAdderPhone] = useState(false);

  const [txtAddressValue, setTxtAddressValue] = useState('');
  const [txtCityValue, setTxtCityValue] = useState('');
  const [txtPostalCodeValue, setTxtPostalCodeValue] = useState('');
  const [txtCountryValue, setTxtCountryValue] = useState('IT');
  const [txtAddressReferenceValue, setTxtAddressReferenceValue] = useState('');
  const [addressType, setAddressType] = useState('Casa');
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [optionsAddress, setOptionsAddress] = useState([]);
  const [activeAddress, setActiveAddress] = useState(false);
  const [isAdderAddress, setIsAdderAddress] = useState(false);



  //#region EmailHandling

  const handleEmailAdd = useCallback(() => {
    if (txtEmailValue === '' || txtEmailValue === undefined)
      return;

    setEmail((email) => {
      const newEmails = email;
      //@ts-ignore
      newEmails.push(txtEmailValue);
      return newEmails;
    });

    setEmailReference((emailReference) => {
      const newEmailReferences = emailReference;
      //@ts-ignore
      newEmailReferences.push(emailType);
      return newEmailReferences;
    });

    return (txtEmailValue + " - " + emailType);

  }, [txtEmailValue, emailType]);

  const handleEmailModify = useCallback((sel: string) => {
    if (txtEmailValue === '' || txtEmailValue === undefined)
      return;

    const modEmail = sel.split(' - ')[0];
    const modEmailReference = sel.split(' - ')[1];

    //@ts-ignore
    setEmail((email) => {
      const newEmails = email.map((originalEm) => {
        if (originalEm === modEmail) {
          return txtEmailValue;
        }
        return originalEm;
      });
      return newEmails;
    });

    //@ts-ignore
    setEmailReference((emailReference) => {
      const newEmailReferences = emailReference.map((originalEmR) => {
        if (originalEmR === modEmailReference) {
          return emailType;
        }
        return originalEmR;
      });
      return newEmailReferences;
    });

    return (txtEmailValue + " - " + emailType);

  }, [txtEmailValue, emailType]);

  const handleTxtEmailValue = useCallback((e) => {
    setTxtEmailValue(e);
  }, []);

  const handleAddEmail = useCallback(() => {
    setTxtEmailValue('');
    setTxtEmailReferenceValue('');
  }, []);

  const handleModEmail = useCallback((sel: string) => {

    if (sel === '' || sel === undefined)
      return;

    //@ts-ignore
    const modEmail = sel.split(' - ')[0];
    //@ts-ignore
    const modEmailReference = sel.split(' - ')[1];

    setTxtEmailValue(modEmail);
    setTxtEmailReferenceValue(modEmailReference);

  }, []);

  const handleDelEmail = useCallback((sel: string) => {

    if (sel === '' || sel === undefined)
      return;

    //@ts-ignore
    const modEmail = sel.split(' - ')[0];
    //@ts-ignore
    const modEmailReference = sel.split(' - ')[1];

    setEmail((email) => {
      //@ts-ignore
      const indexOfDeletion = email.indexOf(modEmail);
      email.splice(indexOfDeletion, 1);
      return email;
    });

    setEmailReference((emailReference) => {
      //@ts-ignore
      const indexOfDeletion = emailReference.indexOf(modEmailReference);
      emailReference.splice(indexOfDeletion, 1);
      return emailReference;
    });

  }, []);
  //#endregion

  //#region PhoneHandling

  const handlePhoneAdd = useCallback(() => {
    if (txtPhoneValue === '' || txtPhoneValue === undefined)
      return;

    setPhone((phone) => {
      const newPhones = phone;
      //@ts-ignore
      newPhones.push(txtPhoneValue);
      return newPhones;
    });

    setPhoneReference((phoneReference) => {
      const newPhoneReferences = phoneReference;
      //@ts-ignore
      newPhoneReferences.push(phoneType);
      return newPhoneReferences;
    });

    return (txtPhoneValue + " - " + phoneType);
  }, [txtPhoneValue, phoneType]);

  const handlePhoneModify = useCallback((sel: string) => {
    if (txtPhoneValue === '' || txtPhoneValue === undefined)
      return;

    const modPhone = sel.split(' - ')[0];
    const modPhoneReference = sel.split(' - ')[1];

    //@ts-ignore
    setPhone((phone) => {
      const newPhones = phone.map((OriginalPh) => {
        if (OriginalPh === sel) {
          return txtPhoneValue;
        }
        return OriginalPh;
      });
      return newPhones;
    });

    //@ts-ignore
    setPhoneReference((phoneReference) => {
      const newPhoneReferences = phoneReference.map((originalPhR) => {
        if (originalPhR === modPhoneReference) {
          return phoneType;
        }
        return originalPhR;
      });
      return newPhoneReferences;
    });

    return (txtPhoneValue + " - " + phoneType);
  }, [txtPhoneValue, phoneType]);

  const handleTxtPhoneValue = useCallback((e) => {
    setTxtPhoneValue(e);
  }, [])

  const handleAddPhone = useCallback(() => {
    setTxtPhoneValue('');
    setTxtPhoneReferenceValue('');
  }, []);

  const handleModPhone = useCallback((sel: string) => {

    if (sel === '' || sel === undefined)
      return;

    //@ts-ignore
    const modPhone = sel.split(' - ')[0];
    //@ts-ignore
    const modPhoneReference = sel.split(' - ')[1];

    setTxtPhoneValue(modPhone);
    setTxtPhoneReferenceValue(modPhoneReference);

  }, []);

  const handleDelPhone = useCallback((sel: string) => {
    if (sel === '' || sel === undefined)
      return;

    //@ts-ignore
    const modPhone = sel.split(' - ')[0];
    //@ts-ignore
    const modPhoneReference = sel.split(' - ')[1];

    setPhone((phone) => {
      //@ts-ignore
      const indexOfDeletion = phone.indexOf(modPhone);
      phone.splice(indexOfDeletion, 1);
      return phone;
    });

  }, []);
  //#endregion

  //#region AddressHandling

  const handleAddressAdd = useCallback(() => {
    if (txtAddressValue === '' || txtAddressValue === undefined || txtCityValue === '' || txtCityValue === undefined || txtPostalCodeValue === '' || txtPostalCodeValue === undefined || txtCountryValue === '' || txtCountryValue === undefined)
      return;

    setAddress((address) => {
      const newAddresses = address;
      //@ts-ignore
      newAddresses.push(txtAddressValue);
      return newAddresses;
    });

    setCity((city) => {
      const newCities = city;
      //@ts-ignore
      newCities.push(txtCityValue);
      return newCities;
    });

    setPostalCode((postalCode) => {
      const newPostalCodes = postalCode;
      //@ts-ignore
      newPostalCodes.push(txtPostalCodeValue);
      return newPostalCodes;
    });

    setCountry((country) => {
      const newCountries = country;
      //@ts-ignore
      newCountries.push(txtCountryValue);
      return newCountries;
    });

    setAddressReference((addressReference) => {
      const newAddressReferences = addressReference;
      //@ts-ignore
      newAddressReferences.push(addressType);
      return newAddressReferences;
    });

    return (txtCountryValue + ", " + txtCityValue + ", " + txtAddressValue + ", " + txtPostalCodeValue + " - " + addressType);
  }, [txtAddressValue, txtCityValue, txtPostalCodeValue, txtCountryValue, addressType]);

  const handleAddressModify = useCallback((sel: string) => {
    if (txtAddressValue === '' || txtAddressValue === undefined || txtCityValue === '' || txtCityValue === undefined || txtPostalCodeValue === '' || txtPostalCodeValue === undefined || txtCountryValue === '' || txtCountryValue === undefined)
      return;

    const modCountry = sel.split(', ')[0];
    const modCity = sel.split(', ')[1];
    const modAddress = sel.split(', ')[2];
    const temp = sel.split(', ')[3];
    const modPostalCode = temp.split(' - ')[0];
    const modAddressReference = temp.split(' - ')[1];

    //@ts-ignore
    setAddress((address) => {
      const newAddresses = address.map((originalAd: string) => {
        if (originalAd === modAddress) {
          return txtAddressValue;
        }
        return originalAd;
      });
      return newAddresses;
    });

    //@ts-ignore
    setCity((city) => {
      const newCities = city.map((originalCi: string) => {
        if (originalCi === modCity) {
          return txtCityValue;
        }
        return originalCi;
      });
      return newCities;
    });

    //@ts-ignore
    setCountry((country) => {
      const newCountries = country.map((originalCo: string) => {
        if (originalCo === modCountry) {
          return txtCountryValue;
        }
        return originalCo;
      });
      return newCountries;
    });

    //@ts-ignore
    setPostalCode((postalCode) => {
      const newPostalCodes = postalCode.map((originalPC: string) => {
        if (originalPC === modPostalCode) {
          return txtPostalCodeValue;
        }
        return originalPC;
      });
      return newPostalCodes;
    });

    //@ts-ignore
    setAddressReference((addressReference) => {
      const newAddressReferences = addressReference.map((originalAdR) => {
        if (originalAdR === modAddressReference) {
          return addressType;
        }
        return originalAdR;
      });
      return newAddressReferences;
    });

    return (txtCountryValue + ", " + txtCityValue + ", " + txtAddressValue + ", " + txtPostalCodeValue + " - " + addressType);
  }, [txtAddressValue, txtCityValue, txtPostalCodeValue, txtCountryValue, addressType]);

  const handleTxtAddressValue = useCallback((e) => {
    setTxtAddressValue(e);
  }, [])

  const handleTxtCountryValue = useCallback((e) => {
    setTxtCountryValue(e);
  }, [])

  const handleTxtCityValue = useCallback((e) => {
    setTxtCityValue(e);
  }, [])

  const handleTxtPostalCodeValue = useCallback((e) => {
    setTxtPostalCodeValue(e);
  }, [])

  const handleAddAddress = useCallback(() => {
    setTxtAddressValue('');
    setTxtCountryValue('IT');
    setTxtCityValue('');
    setTxtPostalCodeValue('');
    setTxtAddressReferenceValue('');

  }, []);

  const handleModAddress = useCallback((sel: string) => {

    if (sel === '' || sel === undefined)
      return;

    //@ts-ignore
    const modCountry = sel.split(', ')[0];
    //@ts-ignore
    const modCity = sel.split(', ')[1];
    //@ts-ignore
    const modAddress = sel.split(', ')[2];
    //@ts-ignore
    const temp = sel.split(', ')[3];
    //@ts-ignore
    const modPostalCode = temp.split(' - ')[0];
    //@ts-ignore
    const modAddressReference = temp.split(' - ')[1];

    setTxtAddressValue(modAddress);
    setTxtCountryValue(modCountry);
    setTxtCityValue(modCity);
    setTxtPostalCodeValue(modPostalCode);
    setTxtAddressReferenceValue(modAddressReference);

  }, []);

  const handleDelAddress = useCallback((sel: string) => {
    if (sel === '' || sel === undefined)
      return;

    //@ts-ignore
    const modCountry = sel.split(', ')[0];
    //@ts-ignore
    const modCity = sel.split(', ')[1];
    //@ts-ignore
    const modAddress = sel.split(', ')[2];
    //@ts-ignore
    const temp = sel.split(', ')[3];
    //@ts-ignore
    const modPostalCode = temp.split(' - ')[0];
    //@ts-ignore
    const modAddressReference = temp.split(' - ')[1];

    setAddress((address) => {
      //@ts-ignore
      const indexOfDeletion = address.indexOf(modAddress);
      address.splice(indexOfDeletion, 1);
      return address;
    });

    setCity((city) => {
      //@ts-ignore
      const indexOfDeletion = city.indexOf(modCity);
      city.splice(indexOfDeletion, 1);
      return city;
    });

    setPostalCode((postalCode) => {
      //@ts-ignore
      const indexOfDeletion = postalCode.indexOf(modPostalCode);
      postalCode.splice(indexOfDeletion, 1);
      return postalCode;
    });

    setCountry((country) => {
      //@ts-ignore
      const indexOfDeletion = country.indexOf(modCountry);
      country.splice(indexOfDeletion, 1);
      return country;
    });

    setAddressReference((addressReference) => {
      //@ts-ignore
      const indexOfDeletion = addressReference.indexOf(modAddressReference);
      addressReference.splice(indexOfDeletion, 1);
      return addressReference;
    });

  }, []);

  //#endregion





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
    setFirstname('');
    setLastname('');
    setEmail([]);
    setEmailReference([]);
    setPhone([]);
    setPhoneReference([]);
    setPiva('');
    setCf('');
    setNote('');
    setType('private');
    setAddress([]);
    setCity([]);
    setPostalCode([]);
    setCountry([]);
    setAddressReference([]);
    setOptionsPhone([]);
    setOptionsAddress([]);
    setIsDirty(true);
  }, []);

  /**
   * Save data
   */
  const handleSave = useCallback(async () => {
    try {
      // Check firstname & lastname
      if (type === 'private' && (firstname === '' || lastname === '')) {
        if (firstname === '') setValidationNameError(true);
        if (lastname === '') setValidationLastnameError(true);
        return;
      } else if (type === 'company' && firstname === '') {
        setValidationNameError(true);
        return;
      }

      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/customers/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: firstname + (type === 'private' ? (" " + lastname) : ""),   //Check if private, if so there is also last name, otherwise first name only (as is company name)
          email: email,
          email_type: emailReference,
          cf: cf,
          piva: piva,
          ateco: ateco,
          job: job,
          phone: phone,
          phone_type: phoneReference,
          type: type,
          address: address,
          city: city,
          postal_code: postalCode,
          country: country,
          address_type: addressReference,
          note: note
        })
      })
      const response = await data.json();

      if (response.status === 'success') {
        setActive(true);
        setTimeout(() => {
          history.push(`/customers/${response.data._id}`);
        }, 3000);
      } else if (response.status === 'customer_exists') {
        setExistError(true)
      } else {
        setSaveError(true);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDirty(false);
  }, [firstname, type, lastname, email, emailReference, cf, piva, ateco, job, phone, phoneReference, address, city, postalCode, country, addressReference, note, history]);

  /** Handler */
  const handleFirstnameChange = useCallback((e) => {
    setFirstname(e);
    if (validationNameError) setValidationNameError(false);
  }, [validationNameError]);
  const handleLastnameChange = useCallback((e) => {
    setLastname(e);
    if (validationLastnameError) setValidationLastnameError(false);
  }, [validationLastnameError]);
  const handleCfChange = useCallback((e) => {
    setCf(e);
  }, []);
  const handlePivaChange = useCallback((e) => {
    setPiva(e);
  }, []);
  const handleAtecoChange = useCallback((e) => {
    setAteco(e);
  }, []);
  const handleTypeChange = useCallback((e) => {
    setType(e);
    setValidationLastnameError(false);
    setValidationNameError(false);
  }, []);
  const handleNoteChange = useCallback((e) => {
    setNote(e);
  }, []);

  //Used to set type of customer options
  const options = [
    { label: 'Privato', value: 'private' },
    { label: 'Azienda', value: 'company' },
  ];

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

  /**
   * Load countries, called only once when mounting components
   */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/countries', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          let tmp = [];
          for (const item of response.data) {
            tmp.push({ value: item.code, label: item.name });       //Sets value as code of country and label as name of country
          }
          // @ts-ignore
          setCountryOptions(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCountries();
  }, [])

  const modalEmail = (
    <div>
      <FormLayout>
        <FormLayout.Group>
          <TextField type="email" label="Indirizzo email" value={txtEmailValue} onChange={handleTxtEmailValue} />
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
    </div>);

  const modalPhone = (
    <div>
      <FormLayout>
        <FormLayout.Group>
          <TextField type="tel" label="Numero di telefono" value={txtPhoneValue} onChange={handleTxtPhoneValue} />
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
    </div>);

  const modalAddress = (
    <div>
      <FormLayout>
        <FormLayout.Group>
          <Select label="Stato" options={countryOptions} onChange={handleTxtCountryValue} value={txtCountryValue} />
        </FormLayout.Group>
        <FormLayout.Group>
          <TextField type="text" label="Indirizzo" value={txtAddressValue} onChange={handleTxtAddressValue} />
        </FormLayout.Group>
        <FormLayout.Group>
          <TextField type="text" label="Città" value={txtCityValue} onChange={handleTxtCityValue} />
          <TextField type="text" label="Codice Postale" value={txtPostalCodeValue} onChange={handleTxtPostalCodeValue} />
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
    </div>);

  /**
   * Search jobs
   */
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [deselectedOptions, setDeselectedOptions] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);

  /**
   * Search ateco
   */
  const [selectedAtecoOptions, setSelectedAtecoOptions] = useState([]);
  const [inputAtecoValue, setInputAtecoValue] = useState('');
  const [deselectedAtecoOptions, setDeselectedAtecoOptions] = useState([]);
  const [atecoOptions, setAtecoOptions] = useState([]);

  /**
   * Fetch data: 
   * - jobs
   * - ateco codes
   */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/jobs', {
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
            tmp.push({ value: item._id, label: item.label });
          }
          // @ts-ignore
          setDeselectedOptions(tmp);
          // @ts-ignore
          setJobOptions(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const fetchAteco = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/ateco', {
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
            tmp.push({ value: item._id, label: item.label });
          }
          // @ts-ignore
          setDeselectedAtecoOptions(tmp);
          // @ts-ignore
          setAtecoOptions(tmp);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchJobs();
    fetchAteco();
  }, [])

  /**
   * Autocomplete Controls
   */

  /** Job */
  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setJobOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) => {
        // @ts-ignore
        return option.label.match(filterRegex)
      });
      setJobOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem: any) => {
        const matchedOption = jobOptions.find((option) => {
          // @ts-ignore
          return option.value.match(selectedItem);
        });
        // @ts-ignore
        return matchedOption;
      });
      setSelectedOptions(selected);
      setInputValue(selectedValue[0].label);
      // handleCustomerNameChange(selected);
      // handleCustomerIdChange(selectedValue[0].value);
      setJob(selectedValue[0].value);
    },
    [jobOptions],
  );

  const jobTextField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Professione"
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Cerca"
    />
  );

  /** Ateco */
  const updateAtecoText = useCallback(
    (value) => {
      setInputAtecoValue(value);

      if (value === '') {
        setAtecoOptions(deselectedAtecoOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedAtecoOptions.filter((option) => {
        // @ts-ignore
        return option.label.match(filterRegex)
      });
      setAtecoOptions(resultOptions);
    },
    [deselectedAtecoOptions]
  );

  const updateAtecoSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem: any) => {
        const matchedOption = atecoOptions.find((option) => {
          // @ts-ignore
          return option.value.match(selectedItem);
        });
        // @ts-ignore
        return matchedOption;
      });
      setSelectedAtecoOptions(selected);
      setInputAtecoValue(selectedValue[0].label);
      // handleCustomerNameChange(selected);
      // handleCustomerIdChange(selectedValue[0].value);
      setAteco(selectedValue[0].value);
    },
    [atecoOptions],
  );

  const atecoTextField = (
    <Autocomplete.TextField
      onChange={updateAtecoText}
      label="ATECO"
      value={inputAtecoValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Cerca"
    />
  );

  /**
   * Error markups & toast
   */
  const toastMarkup = active ? (
    <Toast content="Il cliente è stato creato con successo." onDismiss={toggleActive} />
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

  const existErrorMarkup = existError && (
    <Layout.Section>
      <Banner
        title="Esiste già un cliente associato a questo codice fiscale"
        status="critical"
        onDismiss={() => setExistError(false)}
      >
        <p>Si è pregati di controllare il codice fiscale se si desidera proseguire.</p>
      </Banner>
    </Layout.Section>
  )

  // ---- Page markup ----
  const actualPageMarkup = (
    <Page
      title='Cliente'
      breadcrumbs={[{ content: 'Clienti', url: '/customers' }]}
    >
      <Layout>
        {/* Banner */}
        {saveErrorMarkup}
        {existErrorMarkup}
        {/* Panoramica cliente */}
        <Layout.AnnotatedSection
          title="Panoramica cliente"
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <Select label="Tipologia cliente" options={options} onChange={handleTypeChange} value={type} />
              </FormLayout.Group>
              <FormLayout.Group>
                {/* Logic to display either private's or company's naming info */}
                {type === 'private' && <TextField type="text" label="Nome" value={firstname} onChange={handleFirstnameChange} error={validationNameError && "Il nome è obbligatorio"} />}
                {type === 'private' && <TextField type="text" label="Cognome" value={lastname} onChange={handleLastnameChange} error={validationLastnameError && "Il cognome è obbligatorio"} />}
                {type === 'company' && <TextField type="text" label="Ragione Sociale" value={firstname} onChange={handleFirstnameChange} error={validationNameError && "La regione sociale è obbligatoria"} />}
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField type="text" label="Codice Fiscale" value={cf} onChange={handleCfChange} />
              </FormLayout.Group>
              <FormLayout.Group>
                {type === 'private' &&
                  <Autocomplete
                    options={jobOptions}
                    selected={selectedOptions}
                    onSelect={updateSelection}
                    textField={jobTextField}
                  />
                }
              </FormLayout.Group>
              <FormLayout.Group>
                {/* Logic checks if piva is to be displayed */}
                {type === 'company' && <TextField type="text" label="Partita IVA" value={piva} onChange={handlePivaChange} />}
                {/* {type === 'company' && <TextField type="text" label="Codice ATECO" value={ateco} onChange={handleAtecoChange} />} */}
                {type === 'company' &&
                  <Autocomplete
                    options={atecoOptions}
                    selected={selectedAtecoOptions}
                    onSelect={updateAtecoSelection}
                    textField={atecoTextField}
                  />
                }
              </FormLayout.Group>
              <FormLayout.Group>
                {/* {emailJSX} */}
              </FormLayout.Group>
              <FormLayout.Group>
                {/* {phoneJSX} */}
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
        {/* Indirizzo */}
        <Layout.AnnotatedSection
          title="Indirizzo"
        >
          <Card sectioned>
            {/* {addressJSX} */}
          </Card>
        </Layout.AnnotatedSection>
        {/* Note */}
        <Layout.AnnotatedSection
          title="Note"
        >
          <Card sectioned>
            <TextField type="text" label="Note Sul Cliente" value={note} onChange={handleNoteChange} multiline={6} />
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

