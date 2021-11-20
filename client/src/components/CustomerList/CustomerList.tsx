// @ts-nocheck

import {
  Avatar, Card, EmptyState, FilterInterface, Filters, ResourceItem, ResourceList, TextStyle, Badge,
  Pagination,
  Stack
} from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';

import styles from './CustomerList.module.css';

export function CustomerList() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [taggedWith, setTaggedWith] = useState('VIP');
  const [queryValue, setQueryValue] = useState(null);
  const [sortValue, setSortValue] = useState('DATE_CREATED_DESC');
  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);
  const [total, setTotal] = useState(-1);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/client', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response) {
          console.log(response)
          const tmp = [];
          for (const item of response) {
            // item.name = customersMap.get(item.clientId);
            tmp.push(item);
          }

          setItems(tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? 1 : -1));
          setFrontItems(tmp.sort((a, b) => dayjs(b.createdAt).isAfter(a.createdAt) ? 1 : -1));
          setTotal(tmp.length);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [])

  const filters = [];

  // Filtering
  useEffect(() => {
    const filterItems = () => {
      const filteredItems = items.filter(item => {
        return item.name.toLowerCase().includes(queryValue.toLowerCase());
      })
      setFrontItems(filteredItems);
    }
    filterItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryValue])

  const handleQueryChange = useCallback((e) => {
    setQueryValue(e);
  }, []);

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      onQueryChange={handleQueryChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
    </Filters>
  );

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
   * Render item
   */
  function renderItem(item: any, _: any, index: number | undefined) {
    const { _id, name } = item;
    const media = <Avatar customer={false} size="medium" name={'_id'} />;
    const url = `/admin/users/${_id}`;

    return (
      <ResourceItem
        id={index}
        url={url}
        media={media}
        sortOrder={index}
        accessibilityLabel={`View details for ${name}`}
      >
        {/* <div className={styles.dataScroll}>
          <div>
            <TextStyle variation="strong">{item.name}</TextStyle>
          </div>
          <div>
            <p>
              <TextStyle variation="subdued">Ruolo: </TextStyle>
            </p>
          </div>
        </div> */}
        <Stack>
          <Stack.Item>
            <TextStyle variation="strong">{item.name}</TextStyle>
          </Stack.Item>
          <Stack.Item>

          </Stack.Item>
        </Stack>
      </ResourceItem>
    );
  }

  function resolveItemIds({ id }: any) {
    return id;
  }

  let customerListMarkup = (
    <Card>
      <Card.Section>
        <EmptyState
          heading="Manage customers"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/e7b58a8b2e612fe6cf6f8c9e53830b70.svg"
        >
          <p>
            Here you can manage your customers
          </p>
        </EmptyState>
      </Card.Section>
    </Card>
  );

  /**
   * Markup with items
   */
  if (items.length > 0) {
    customerListMarkup = (
      <Card>
        <ResourceList
          resourceName={resourceName}
          items={frontItems}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          resolveItemId={resolveItemIds}
          filterControl={filterControl}
          sortValue={sortValue}
          sortOptions={[
            { label: 'Customer added date (from the most recent)', value: 'DATE_CREATED_DESC' },
            { label: 'Customer added date (from the least recent)', value: 'DATE_CREATED_ASC' },
          ]}
          onSortChange={(selected) => {
            setSortValue(selected);
          }}
          totalItemsCount={total}
        />
      </Card>
    )
  }

  return customerListMarkup;
}