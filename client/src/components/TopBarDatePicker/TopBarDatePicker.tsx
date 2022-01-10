import { Button, DatePicker, FormLayout, Popover, Select, Stack, TextField } from '@shopify/polaris';
import { CalendarMinor } from '@shopify/polaris-icons';
import React, { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import './TopBarDatePicker.scss';
import {addDataIntoCache, getCachedData} from "../../utils/CacheUtils";

export function TopBarDatePicker({ vcDate, setVcDate }: any) {
  /**
   * Popover
   */
  const parseDateLabel = (date: Date) => {
    return `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + (date.getDate())).slice(-2)}`;
  }

  const [popoverActive, setPopoverActive] = useState(false);
  const [defaultInput, setDefaultInput] = useState(dayjs().format('YYYY/MM/DD'));
  useEffect(() => {
    const getVirtualTime = async () => {
      const virtualTime = await getCachedData('virtual-clock','http://localhost:3000')
      if(virtualTime){
        setDefaultInput(dayjs(virtualTime).format('YYYY/MM/DD'));
      }
    }
    getVirtualTime();
    }, [])

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
    start: new Date(vcDate),
    end: new Date(vcDate),
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
   * Submit handler
   */
  const handleVcDate = useCallback((e) => {
    setVcDate('MyCache',
      'https://localhost:3000', e);
  }, []);

  // const handleVcDate = addDataIntoCache();

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
        setPopoverActive(false);
        // handleVcDate(response.time);
        console.log(response);
        addDataIntoCache('virtual-clock', 'http://localhost:3000', response.time);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, selectedDates.end, selectedDates.start, handleVcDate]);

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
                weekStartsOn={1}
              />
            </div>
            <TextField autoComplete="off" label="Time" type="time" value={time} onChange={handleTimeChange} />
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