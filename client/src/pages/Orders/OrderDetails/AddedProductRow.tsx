import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle
} from '@shopify/polaris';

export function AddedProductRow({ item, label }: any) {
  const { id, amount, price } = item;
  const [value, setValue] = useState(String(amount));

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
              autoComplete="off"
              disabled
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