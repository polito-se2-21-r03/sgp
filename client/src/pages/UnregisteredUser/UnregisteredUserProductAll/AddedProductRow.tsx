import React, { useCallback, useState } from 'react';

import {
  Stack,
  TextStyle,
  Button,
  Collapsible,
  TextContainer
} from '@shopify/polaris';

import {
  ChevronDownMinor,
  ChevronUpMinor
} from '@shopify/polaris-icons';

export function AddedProductRow({ item }: any) {
  const { price } = item;

  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Stack vertical>
      <Stack.Item>
        <div style={{ overflow: 'hidden' }}>{item.src ? (
          <img src={item.src} width='100%' height='200rem' style={{ objectFit: 'cover' }} />
        ) : (
          <img src="https://images.unsplash.com/photo-1630448927918-1dbcd8ba439b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" style={{ objectFit: 'cover' }} />
        )}</div>
      </Stack.Item>
      <Stack.Item>
        <TextStyle variation="strong">{item.name}</TextStyle>
        <p>
          <Stack distribution="equalSpacing">
            <TextStyle variation="subdued">Farmer: {item.farmer}</TextStyle>
            <Button
              plain
              onClick={handleToggle}
              ariaExpanded={open}
              ariaControls="basic-collapsible"
              icon={open ? ChevronUpMinor : ChevronDownMinor}
            />
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
              Your mailing list lets you contact customers or visitors who
              have shown an interest in your store. Reach out to them with
              exclusive offers or updates about your products.
              {/* {item.description} */}
            </p>
          </TextContainer>
        </Collapsible>
      </Stack.Item>
      <Stack.Item>
        <Stack distribution="trailing" alignment="center">
          <Stack.Item>
            {Number(price).toFixed(2)} €
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}