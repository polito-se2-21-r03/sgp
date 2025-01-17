// @ts-nocheck

import {
  Avatar, Card, EmptyState, Filters, ResourceItem, ResourceList, TextStyle, Badge,
  Button,
  Stack
} from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';

import dayjs from 'dayjs';

export function CustomerList({ handleModal, update }: any) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [taggedWith, setTaggedWith] = useState('VIP');
  const [queryValue, setQueryValue] = useState(null);
  const [sortValue, setSortValue] = useState('DATE_CREATED_DESC');
  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);
  const [total, setTotal] = useState(-1);
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
    const fetchWallets = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/wallet', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();
        const wallets = {};

        if (response) {
          for (const item of response) {
            wallets[item.userId] = item.credit;
          }

          setIsLoading(false);
          return wallets;
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }

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
        const wallets = await fetchWallets();

        if (response) {
          const tmp = [];
          for (const item of response) {
            item["credit"] = wallets[item.id];
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
  }, [update])

  const filters = [];

  // Filtering
  useEffect(() => {
    const filterItems = () => {
      const filteredItems = items.filter(item => {
        const name = `${item.firstname} ${item.lastname}`;
        return name.toLowerCase().includes(queryValue.toLowerCase());
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
    const media = <Avatar customer={false} size="medium" name={'_id'} />;
    const url = `#`;
    const name = `${item.firstname} ${item.lastname}`;

    return (
      <ResourceItem
        id={index}
        url={url}
        media={media}
        sortOrder={index}
        accessibilityLabel={`View details for ${name}`}
      >
        <Stack alignment="center" distribution="equalSpacing">
          <Stack.Item>
            <div>
              <TextStyle variation="strong">{name}</TextStyle>
            </div>
            <div>
              <TextStyle>Email: {item.email} - {item.phone && (`Phone: ${item.phone}`)}</TextStyle>
            </div>
          </Stack.Item>
          <Stack.Item>
            <p>Credit: {Number(item.credit).toFixed(2)} €</p>
            <Button plain onClick={() => handleModal(item.id)}>
              Top up account
            </Button>
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
            { label: 'Most recent', value: 'DATE_CREATED_DESC' },
            { label: 'Least recent', value: 'DATE_CREATED_ASC' },
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