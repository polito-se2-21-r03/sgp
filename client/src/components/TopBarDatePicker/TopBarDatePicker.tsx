import { Button, DatePicker, FormLayout, Popover, Select, Stack, TextField } from '@shopify/polaris';
import { CalendarMinor } from '@shopify/polaris-icons';
import React, { useCallback, useEffect, useState } from 'react';

import './TopBarDatePicker.scss';

export function TopBarDatePicker({ handleAnalytics }: any) {
  /**
   * Popover
   */
  const parseDateLabel = (date: Date) => {
    return `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + (date.getDate())).slice(-2)}`;
  }

  const [popoverActive, setPopoverActive] = useState(false);
  const [defaultInput, setDefaultInput] = useState(parseDateLabel(new Date()));
  const [input, setInput] = useState('This month');

  // Used on first load 
  const [inputIsChanged, setInputIsChanged] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const date = new Date();
  const [{ month, year }, setDate] = useState({ month: date.getMonth(), year: date.getFullYear() });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  const [time, setTime] = useState('');
  const handleTimeChange = useCallback((e) => setTime(e), []);

  const activator = (
    <Button icon={CalendarMinor} onClick={togglePopoverActive}>{defaultInput}</Button>
  )

  /** 
   * Date picker 
   */
  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );

  /** Date picker selected date handler */
  const handleSelectedDate = useCallback((e) => {
    setSelectedDates({
      start: e.start,
      end: e.end,
    });
  }, []);


  /**
   * Data fetching:
   * - fetch branches
   * - fetch analytics
   */
  useEffect(() => {
    let customers: any[] = [];
    const branchesMap = new Map();

    // Fetch clients
    // const fetchClients = async () => {
    //   try {
    //     const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/customers', {
    //       method: 'GET',
    //       credentials: 'include',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //     })
    //     const response = await data.json();

    //     if (response.status === 'success') {
    //       let tmp = [];
    //       for (const item of response.data) {
    //         tmp.push({ id: item._id, name: item.name });
    //       }
    //       // @ts-ignore
    //       customers = tmp;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // fetchClients();

    // // Fetch Branches
    // const fetchBranches = async () => {
    //   try {
    //     const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/branches', {
    //       method: 'GET',
    //       credentials: 'include',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //     })
    //     const response = await data.json();

    //     if (response.status === 'success') {
    //       for (const item of response.data) {
    //         branchesMap.set(item._id, item.label);
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // fetchBranches();

    // // Fetch analytics
    // const fetchAnalytics = async () => {
    //   try {
    //     const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/analytics', {
    //       method: 'POST',
    //       credentials: 'include',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         start: selectedDates.start,
    //         end: selectedDates.end
    //       })
    //     })
    //     const response = await data.json();

    //     if (response.status === 'success') {
    //       const tmp = [];
    //       for (const item of response.data.scadenze) {
    //         const itemCustomer = item.customer_id;
    //         let customerName = '';

    //         customers.forEach((customer) => {
    //           if (customer.id === itemCustomer)
    //             customerName = customer.name;
    //         });

    //         item.branch_id = branchesMap.get(item.branch_id);

    //         tmp.push({ ...item, customer: customerName });
    //       }

    //       const res = {
    //         premioNetto: (response.data.aggData.length !== 0) ? response.data.aggData[0].premioNetto : 0,
    //         provvTot: (response.data.aggData.length !== 0) ? response.data.aggData[0].provvTot : 0,
    //         clienti: response.data.clienti,
    //         scadenze: tmp,
    //       }
    //       handleAnalytics(res);
    //     } else {
    //       const res = {
    //         provvTot: 0
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Submit handler
   */
  const handleSubmit = useCallback(async () => {
    try {
      setDefaultInput(parseDateLabel(selectedDates.start));
      setInputIsChanged(true);

      const milliseconds = selectedDates.start.getTime() + (Number(time.split(':')[0]) * 60 + Number(time.split(':')[1])) * 60 * 1000;
      const newDate = (new Date(milliseconds)).toISOString();

      const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + `/virtual-time/${newDate}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      const response = await data.json();

      if (response) {
        console.log(response);
        setPopoverActive(false);
        // const res = {
        //   premioNetto: (response.data.aggData.length !== 0) ? response.data.aggData[0].premioNetto : 0,
        //   provvAttive: (response.data.aggData.length !== 0) ? response.data.aggData[0].provvAttive : 0,
        //   provvPassive: (response.data.aggData.length !== 0) ? response.data.aggData[0].provvPassive : 0,
        //   clienti: response.data.clienti,
        //   scadenze: response.data.scadenze,
        // }
        // handleAnalytics(res);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, selectedDates.end, selectedDates.start]);

  const popoverMarkup = (
    <div>
      <Popover
        active={popoverActive}
        activator={activator}
        onClose={togglePopoverActive}
        ariaHaspopup={false}
        preferredAlignment="left"
        fluidContent
      >
        <Popover.Pane sectioned>
          <Stack vertical wrap>
            <div className="popoverDatePicker">
              <DatePicker
                month={month}
                year={year}
                onChange={handleSelectedDate}
                onMonthChange={handleMonthChange}
                selected={selectedDates}
              />
            </div>
            <TextField label="Time" type="time" value={time} onChange={handleTimeChange} />
          </Stack>
        </Popover.Pane>
        <Popover.Pane fixed>
          <Popover.Section>
            <Stack distribution="equalSpacing">
              <div>
                <Button onClick={() => { setPopoverActive(false) }}>Cancel</Button>
              </div>
              <div>
                <Button
                  primary
                  disabled={time === ''}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </div>
            </Stack>
          </Popover.Section>
        </Popover.Pane>
      </Popover>
    </div>
  )

  return popoverMarkup;
}