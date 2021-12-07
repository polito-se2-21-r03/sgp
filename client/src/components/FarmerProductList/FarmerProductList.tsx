// @ts-nocheck

import { Card, EmptyState, Badge, Filters, TextStyle, IndexTable, Link, Select, useIndexResourceState } from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';

import dayjs from 'dayjs';

export function FarmerProductList() {
  const [queryValue, setQueryValue] = useState(null);
  const [taggedWith, setTaggedWith] = useState(null);
  const [sortValue, setSortValue] = useState('DATE_CREATED_DESC');
  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/product', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response) {
          const tmp = [];
          for (const item of response) {
            tmp.push(item);
          }

          setItems(tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? 1 : -1));
          setFrontItems(tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? 1 : -1));
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
    fetchProducts();
  }, []);

  /**
   * Handle search query
   */
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
  const handleClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  /**
   * Filters
   */
  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }

  const filters = [];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
      {
        key: 'taggedWith',
        label: disambiguateLabel('taggedWith', taggedWith),
        onRemove: handleTaggedWithRemove,
      },
    ]
    : [];

  // Filtering
  useEffect(() => {
    const filterItems = () => {
      const filteredItems = items.filter(item => {
        return item.name.toLowerCase().includes(queryValue ? queryValue.toLowerCase() : '');
      })
      setFrontItems(filteredItems);
    }
    filterItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryValue]);

  /**
   * Handle sort
   */
  useEffect(() => {
    if (sortValue === 'DATE_CREATED_DESC') {
      const tmp = [...items];
      // @ts-ignore
      tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? 1 : -1);
      setFrontItems(tmp);
    } else if (sortValue === 'DATE_CREATED_ASC') {
      const tmp = [...items];
      // @ts-ignore
      tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? -1 : 1);
      setFrontItems(tmp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortValue]);

  /**
   * Row markup
   */
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(frontItems);

  const rowMarkup = frontItems.map(
    (item, index) => {

      return (
        <IndexTable.Row
          id={item.id}
          key={item.id}
          selected={selectedResources.includes(item.id)}
          position={index}
        >
          <IndexTable.Cell>
            <div style={{ overflow: 'hidden', width: '50px', heigth: '50px' }}>{item.src ? (
              <img src={item.src} style={{ objectFit: 'contain' }} />
            ) : (
              <img src="https://images.unsplash.com/photo-1630448927918-1dbcd8ba439b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" style={{ objectFit: 'cover' }} />
            )}</div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextStyle variation="strong">
              <Link
                // url={`/products/${item.id}`}
                url="#"
                removeUnderline
                monochrome
                passHref
                data-primary-link>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  data-primary-link>
                  {item.name}
                </a>
              </Link>
            </TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {item.quantity}
          </IndexTable.Cell>
          <IndexTable.Cell>
            -
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    }
  );

  const emptyList = (
    <EmptyState
      heading="Manage products"
      image="https://cdn.shopify.com/shopifycloud/web/assets/v1/e7b58a8b2e612fe6cf6f8c9e53830b70.svg"
    >
      <p>
        Here you can manage your products
      </p>
    </EmptyState>
  );

  /**
   * Markup with items
   */
  useEffect(() => {
    if (items.length > 0)
      setIsLoading(false);
  }, [items]);

  const customerListMarkup = (
    <Card>
      <div style={{ padding: '16px', display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Filters
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            queryPlaceholder={'Filter products'}
            onQueryChange={setQueryValue}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
          />
        </div>
        <div style={{ paddingLeft: '0.4rem' }}>
          <Select
            labelInline
            label="Sort by"
            options={[
              { label: 'Product added date (from the most recent)', value: 'DATE_CREATED_DESC' },
              { label: 'Product added date (from the least recent)', value: 'DATE_CREATED_ASC' },
            ]}
            value={sortValue}
            onChange={(selected) => {
              setSortValue(selected);
            }}
          />
        </div>
      </div>
      <IndexTable
        resourceName={resourceName}
        emptyState={emptyList}
        itemCount={frontItems.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        hasMoreItems
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: '' },
          { title: 'Product' },
          { title: 'Inventory' },
          { title: 'Supplier' },
        ]}
        sort
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  )

  return customerListMarkup;
}