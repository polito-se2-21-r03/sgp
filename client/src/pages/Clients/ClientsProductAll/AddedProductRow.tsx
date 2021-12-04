import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle,
  Button
} from '@shopify/polaris';

export function AddedProductRow({ item, addProduct }: any) {
  const { price } = item;
  const [value, setValue] = useState('0');
  const [total, setTotal] = useState(0);

  const handleValueChange = useCallback((newValue) => {
    setValue(newValue);
    setTotal(total + (Number(newValue)) * price);
  }, []);

  const handleAddProduct = useCallback(() => {
    addProduct(item, value);
  }, [value]);

  return (
    <Stack vertical>
      <Stack.Item>
        <div style={{ overflow: 'hidden', width: '100%', height: '20rem' }}>{item.src ? (
          <img src={item.src} style={{ objectFit: 'cover' }} />
        ) : (
          <img src="https://images.unsplash.com/photo-1630448927918-1dbcd8ba439b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" style={{ objectFit: 'cover' }} />
        )}</div>
      </Stack.Item>
      <Stack.Item>
        <TextStyle variation="strong">{item.name}</TextStyle>
        <p><TextStyle variation="subdued">Farmer: {item.farmer}</TextStyle></p>
      </Stack.Item>
      <Stack.Item>
        <Stack distribution="equalSpacing" alignment="center">
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
                {Number(price).toFixed(2)} €
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}