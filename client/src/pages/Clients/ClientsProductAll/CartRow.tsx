import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle,
  Button,
  Collapsible,
  TextContainer,
  Link
} from '@shopify/polaris';

import {
  CancelSmallMinor,
  ChevronDownMinor,
  ChevronUpMinor,
  MinusMinor,
  PlusMinor
} from '@shopify/polaris-icons';

export function CartRow({ item, name, updateProduct }: any) {
  const [value, setValue] = useState(String(item.amount));

  const handleValueChange = useCallback((newValue) => {
    if (Number(newValue) >= 0) {
      setValue(newValue);
      updateProduct(item, newValue);
    }
  }, []);

  return (
    <div style={{ paddingTop: '5px' }}>
      <Stack distribution="equalSpacing">
        <Stack.Item>
          <div style={{ transform: 'translateY(50%)' }}>
            <p key={item.productId} style={{ width: '5rem' }}>
              {name}
            </p>
          </div>
        </Stack.Item>
        <Stack.Item>
          { /* x{item.amount} */}
          <TextField
            label=""
            type="number"
            value={value}
            onChange={handleValueChange}
            connectedLeft={
              <Button
                icon={MinusMinor}
                onClick={() => handleValueChange(String(Number(value) - 1))}
                disabled={item.amount <= 1 ? true : false}
              />
            }
            connectedRight={
              <Button
                icon={PlusMinor}
                onClick={() => handleValueChange(String(Number(value) + 1))}
              />
            }
            autoComplete="off"
          />
        </Stack.Item>
        <Stack.Item>
          <div style={{ transform: 'translateY(30%)' }}>
            <Button
              plain
              icon={CancelSmallMinor}
              onClick={() => handleValueChange(String(0))}
            />
          </div>
        </Stack.Item>
      </Stack>
      <hr />
    </div>
  );
}