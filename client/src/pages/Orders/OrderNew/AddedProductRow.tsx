import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle
} from '@shopify/polaris';

<<<<<<< HEAD
export function AddedProductRow({ item, label, total, setTotal }: any) {
=======
export function AddedProductRow({ item, label, total, updateProduct }: any) {
>>>>>>> a26b940791cb8889781ec9958babbedf883e6d53
  const { productId, amount, price } = item;
  const [value, setValue] = useState(String(amount));

  // const handleValueChange = useCallback((newValue) => {
  //   setValue(newValue);
  //   updateTotal(total + (Number(newValue) - 1) * price);
  // }, []);

  const handleValueChange = useCallback((newValue) => {
<<<<<<< HEAD
    if (newValue >= 0) {
      if (item.quantity - Number(newValue) < 0)
        setValue(String(item.quantity));
      else {
        setValue(newValue);
        setTotal(total + (Number(newValue)) * price);
=======
    if (Number(newValue) >= 0) {
      if (Number(newValue) < 0)
        setValue('1');
      else {
        setValue(newValue);
        updateProduct(item, newValue);
>>>>>>> a26b940791cb8889781ec9958babbedf883e6d53
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
            {Number(price).toFixed(2)} €
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}