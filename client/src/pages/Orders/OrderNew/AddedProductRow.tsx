import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle
} from '@shopify/polaris';

export function AddedProductRow({ item, label, total, updateTotal }: any) {
  const { productId, amount, price } = item;
  const [value, setValue] = useState(String(amount));

  const handleValueChange = useCallback((newValue) => {
    setValue(newValue);
    updateTotal(total + (Number(newValue) - 1) * price);
  }, []);

  return (
    <Stack distribution="equalSpacing" alignment="center">
      <Stack.Item>
        <TextStyle variation="strong">{label}</TextStyle>
      </Stack.Item>
      <Stack.Item>
        <Stack alignment="center">
          <Stack.Item>
            <TextField
              label=""
              type="number"
              value={value}
              onChange={handleValueChange}
              autoComplete="off"
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