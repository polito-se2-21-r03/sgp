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
  ChevronDownMinor,
  ChevronUpMinor
} from '@shopify/polaris-icons';

export function AddedProductRow({ item, addProduct, onCart, setOnCart }: any) {
  const { price } = item;
  const [value, setValue] = useState('0');
  const [total, setTotal] = useState(0);

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

  const handleAddProduct = useCallback(() => {
    if (Number(value) > 0) {
      if (item.quantity - Number(value) >= 0)
        addProduct(item, value);
    }
    setValue('0');
    const tmp = onCart;
    tmp[item.id - 1] = true;
    setOnCart(tmp);
  }, [value]);

  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  return (
    <Stack vertical>
      <Stack.Item>
        <div style={{ overflow: 'hidden' }}>{item.src ? (
          <img src={item.src} width='100%' height='200rem' style={{ objectFit: 'cover' }} />
        ) : (
          <img src="https://images.unsplash.com/photo-1630448927918-1dbcd8ba439b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" width='100%' height='200rem' style={{ objectFit: 'cover' }} />
        )}</div>
      </Stack.Item>
      <Stack.Item>
        <TextStyle variation="strong">{item.name}</TextStyle>
        <p>
          <Stack distribution="equalSpacing">
            <TextStyle variation="subdued">Farmer: {item.farmer}</TextStyle>
            {item.description && (
              <Button
                plain
                onClick={handleToggle}
                ariaExpanded={open}
                ariaControls="basic-collapsible"
                icon={open ? ChevronUpMinor : ChevronDownMinor}
              />
            )}
          </Stack>
        </p>
        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
          expandOnPrint
        >
          <TextContainer>
            <p>
              {item.description}
            </p>
          </TextContainer>
        </Collapsible>
      </Stack.Item>
      <Stack.Item>
        <TextStyle variation="subdued">Availability: {item.quantity} {item.unitOfMeasure}</TextStyle>
      </Stack.Item>
      <Stack.Item>
        <Stack distribution="equalSpacing" alignment="center">
          <Stack.Item>
            <Stack alignment="center">
              <Stack.Item>
                <TextField autoComplete="off"
                  label=""
                  type="number"
                  value={value}
                  onChange={handleValueChange}
                  suffix={item.unitOfMeasure}
                  disabled={onCart[item.id - 1]}
                />
              </Stack.Item>
              <Stack.Item>
                {Number(price).toFixed(2)} €
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Button onClick={handleAddProduct} disabled={Number(value) <= 0 ? true : false}>Add Product</Button>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}