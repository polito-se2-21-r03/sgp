import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle
} from '@shopify/polaris';

export function AddedProductRow({ item }: any) {
  const { id, amount, price, isUpdate, handleSaveCallback } = item;

  return (
    <Stack distribution="equalSpacing" alignment="center">
      <Stack.Item>
          {isUpdate ? <TextField type="number" value={amount} onChange={handleSaveCallback} label={"Amount"} autoComplete="off" /> :
        <TextStyle variation="strong">{item.name} - x{amount} {item.unitOfMeasure}</TextStyle>}
      </Stack.Item>
      <Stack.Item>
        <Stack alignment="center">
          <Stack.Item>
            {Number(amount * price).toFixed(2)} €
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}