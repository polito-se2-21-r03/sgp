// @ts-nocheck

import {
  Card, EmptyState, Filters, TextStyle, Badge,
  Pagination, IndexTable, useIndexResourceState, Select, TextField, Link
} from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';

export function OrderList({ user }: any) {
  const history = useHistory();

  const [selectedItems, setSelectedItems] = useState([]);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  const [sortValue, setSortValue] = useState('DATE_CREATED_DESC');
  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);
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
    singular: 'order',
    plural: 'orders',
  };

  const customersMap = new Map();
  customersMap.set(1, 'Francesco');
  customersMap.set(2, 'Alessandro');

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchClients = async () => {
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
        const clients = {};

        if (response) {
          for (const item of response) {
            clients[item.id] = item.firstname + " " + item.lastname;
          }

          setIsLoading(false);
          return clients;
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }

    const fetchOrders = async () => {
      try {
        console.log(user);
        setIsLoading(true);
        let endpoint = "";
        switch (user.role) {
          case "FARMER":
            endpoint = `/farmer/${user.id}/order`;
            break
          case "CLIENT":
            endpoint = `/order/client/${user.id}`;
            break;
          default:
            endpoint = `/order`;
        }
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + endpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();
        const clients = await fetchClients();
        console.log(response);
        if (response) {
          const tmp = [];
          console.log(response);
          for (const item of response) {
            item["client"] = clients[item.clientId]
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
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [])

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
  }, [queryValue])

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

  /**
   * Render status
   * @param status 
   * @returns 
   */
  const renderStatusMarkup = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (<Badge progress="complete" status="success">Completed</Badge>);
      case 'CONFIRMED':
        return (<Badge progress="incomplete" status="attention">Confirmed</Badge>);
      case 'CREATED':
        return (<Badge progress="incomplete">Created</Badge>);
      case 'DELIVERED':
        return (<Badge progress="complete" status="success">Delivered</Badge>);
      case 'PENDING':
        return (<Badge progress="partiallyComplete" status="warning">Pending</Badge>);
      case 'PENDING CANCELATION':
        return (<Badge progress="incomplete" status="critical">Pending cancelation</Badge>);

      default:
        break;
    }
  }

  const rowMarkup = frontItems.map(
    (item, index) => {
      const key = user.role === "FARMER" ? item.orderId : item.id;
      let target;
      switch (user.role) {
        case "FARMER":
          target = '/farmer'
          break
        case "CLIENT":
          target = '/client';
          break
        default:
          target = ''
      }

      return (
        <IndexTable.Row
          id={key}
          key={key}
          selected={selectedResources.includes(key)}
          position={index}
        >
          <IndexTable.Cell>
            <TextStyle variation="strong">
              <Link url={target + `/orders/${key}`} removeUnderline monochrome passHref>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  data-primary-link>#{key}</a>
              </Link>
            </TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {dayjs(item.createdAt).format('DD MMM HH:mm')}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {renderStatusMarkup(item.status)}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {item.client}
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });

  /**
   * Empty state markup
   */
  let orderListMarkup = (
    <Card>
      <Card.Section>
        <EmptyState
          heading="Manage orders"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/e7b58a8b2e612fe6cf6f8c9e53830b70.svg"
        >
          <p>
            Here you can manage your orders
          </p>
        </EmptyState>
      </Card.Section>
    </Card>
  );

  /**
   * Pagination markup
   */
  const paginationMarkup = items.length > 50
    ? (
      <div className={styles.CustomerListFooter}>
        <Pagination
          hasPrevious={!isFirstPage}
          hasNext={!isLastPage}
        // onPrevious={this.handlePreviousPage}
        // onNext={this.handleNextPage}
        />
      </div>
    )
    : null;

  /**
   * Markup with items
   */
  if (items.length > 0) {
    orderListMarkup = (
      <Card>
        <div style={{ padding: '16px', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Filters
              queryValue={queryValue}
              filters={filters}
              appliedFilters={appliedFilters}
              queryPlaceholder={'Filter customers'}
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
                { label: 'Most recent', value: 'DATE_CREATED_DESC' },
                { label: 'Least recent', value: 'DATE_CREATED_ASC' },
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
          itemCount={frontItems.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          hasMoreItems
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Order' },
            { title: 'Date' },
            { title: 'Status' },
            { title: 'Customer' },
          ]}
          sort
        >
          {rowMarkup}
        </IndexTable>
        {paginationMarkup}
      </Card>
    )
  }

  return orderListMarkup;
}