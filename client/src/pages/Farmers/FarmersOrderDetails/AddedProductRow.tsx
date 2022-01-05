import React, { useCallback, useState } from 'react';

import {
  TextField,
  Stack,
  TextStyle,
  IndexTable,
  useIndexResourceState
} from '@shopify/polaris';

/**
 * TO-DO
 * - aggiungere colore diverso per prodotti già confermati e disattivare pulsante
 */

export function AddedProductRow({ products, handleConfirm }: any) {
  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const resourceIDResolver = (products: any) => {
    return products._id;
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(products, {
    resourceIDResolver
  });

  const promotedBulkActions = [
    {
      content: 'Confirm products',
      onAction: () => handleConfirm(selectedResources),
    },
  ];

  const rowMarkup = products.map(
    ({ productId, name, amount, price }: any, index: number) => (
      <IndexTable.Row
        id={productId}
        key={productId}
        selected={selectedResources.includes(productId)}
        position={index}
      >
        <IndexTable.Cell>
          <TextStyle variation="strong">{name}</TextStyle>
        </IndexTable.Cell>
        <IndexTable.Cell>{amount}</IndexTable.Cell>
        <IndexTable.Cell>{Number(amount * price).toFixed(2)} €</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={products.length}
      selectedItemsCount={
        allResourcesSelected ? 'All' : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      promotedBulkActions={promotedBulkActions}
      headings={[
        { title: 'Name' },
        { title: 'Quantity' },
        { title: 'Amount spent' },
      ]}
    >
      {rowMarkup}
    </IndexTable>
  );
}