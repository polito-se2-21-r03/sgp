import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle
} from '@shopify/polaris';

export function AddedProductRow({ item, label, total, setTotal }: any) {
  const { productId, amount, price } = item;
  const [value, setValue] = useState(String(amount));

  const handleValueChange = useCallback((newValue) => {
    if (newValue >= 0) {
      if (item.quantity - Number(newValue) < 0)
        setValue(String(item.quantity));
      else {
        setValue(newValue);
        setTotal(total + (Number(newValue)) * price);
      }
    }
  }, []);
  return (
    <Stack distribution="equalSpacing" alignment="center">
      <Stack.Item>
        <TextStyle variation="strong">{label}</TextStyle>
      </Stack.Item>
      <Stack.Item>
        <Stack alignment="center">
          <Stack.Item>
            <TextField autoComplete="off"
              label=""
              type="number"
              value={value}
              onChange={handleValueChange}
            />
          </Stack.Item>
          <Stack.Item>
            {price}
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}