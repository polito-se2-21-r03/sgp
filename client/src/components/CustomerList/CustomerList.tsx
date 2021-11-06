// @ts-nocheck

import {
  Card, EmptyState, Filters, TextStyle, Badge,
  Pagination, IndexTable, useIndexResourceState, Select, TextField, Link
} from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import styles from './CustomerList.module.css';

export function CustomerList() {
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
    singular: 'cliente',
    plural: 'clienti',
  };

  const promotedBulkActions = [
    {
      content: 'Modifica clienti',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/customers', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          setItems(response.data);
          setFrontItems(response.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchClients();
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
      tmp.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
      setItems(tmp);
    } else if (sortValue === 'DATE_CREATED_ASC') {
      const tmp = [...items];
      // @ts-ignore
      tmp.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
      setItems(tmp);
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
    (item, index) => (
      <IndexTable.Row
        id={item._id}
        key={item._id}
        selected={selectedResources.includes(item._id)}
        position={index}
      >
        <IndexTable.Cell>
          <TextStyle variation="strong">
            <Link url={`/customers/${item._id}`} removeUnderline monochrome passHref>
              <a
                style={{ color: 'inherit', textDecoration: 'none' }}
                data-primary-link>{item.name}</a>
            </Link>
          </TextStyle>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {item.type === 'company' ? (
            <Badge status="attention" progress="incomplete">Azienda</Badge>
          ) : (
            <Badge progress="incomplete">Privato</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {item.address.length > 0 ?
            `${item.address[0].city}, ${item.address[0].line}, ${item.address[0].postal_code}` :
            (<Badge>Mancante</Badge>)
          }
        </IndexTable.Cell>
        <IndexTable.Cell>
          {item.email.length > 0 ?
            item.email[0].address :
            (<Badge>Mancante</Badge>)
          }
        </IndexTable.Cell>
        <IndexTable.Cell>
          {item.phone.length > 0 ?
            item.phone[0].number :
            (<Badge>Mancante</Badge>)
          }
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  /**
   * Empty state markup
   */
  let customerListMarkup = (
    <Card>
      <Card.Section>
        <EmptyState
          heading="Gestisci i clienti"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/e7b58a8b2e612fe6cf6f8c9e53830b70.svg"
        >
          <p>
            Qua è dove puoi gestire le informazioni dei tuoi clienti
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
    customerListMarkup = (
      <Card>
        <div style={{ padding: '16px', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Filters
              queryValue={queryValue}
              filters={filters}
              appliedFilters={appliedFilters}
              queryPlaceholder={'Filtra clienti'}
              onQueryChange={setQueryValue}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleClearAll}
            />
          </div>
          <div style={{ paddingLeft: '0.4rem' }}>
            <Select
              labelInline
              label="Ordina per"
              options={[
                { label: 'Data aggiunta cliente (dal più recente)', value: 'DATE_CREATED_DESC' },
                { label: 'Data aggiunta cliente (dal meno recente)', value: 'DATE_CREATED_ASC' },
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
          promotedBulkActions={promotedBulkActions}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Nome' },
            { title: 'Tipologia' },
            { title: 'Indirizzo' },
            { title: 'Email' },
            { title: 'Telefono' },
          ]}
          sort
        >
          {rowMarkup}
        </IndexTable>
        {paginationMarkup}
      </Card>
    )
  }

  return customerListMarkup;
}