// @ts-nocheck

import {
  Avatar, Card, EmptyState, FilterInterface, Filters, ResourceItem, ResourceList, TextStyle, Badge,
  Pagination
} from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';

import styles from './UserList.module.css';

export function UserList() {
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
    singular: 'utente',
    plural: 'utenti',
  };

  /**
   * Data fetching
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/admin/users', {
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
          setTotal(response.data.length)
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
      tmp.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
      setFrontItems(tmp);
    } else if (sortValue === 'DATE_CREATED_ASC') {
      const tmp = [...items];
      // @ts-ignore
      tmp.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
      setFrontItems(tmp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortValue]);

  function renderItem(item: any, _: any, index: number | undefined) {
    const { _id, name } = item;
    const media = <Avatar customer={false} size="medium" initials={`${item.firstname[0]}${item.lastname[0]}`} name={'_id'} />;
    const url = `/admin/users/${_id}`;

    return (
      <ResourceItem
        id={index}
        url={url}
        media={media}
        sortOrder={index}
        accessibilityLabel={`View details for ${name}`}
      >
        <div className={styles.dataScroll}>
          <div>
            <TextStyle variation="strong">{item.firstname} {item.lastname} {item._id === JSON.parse(localStorage.getItem('user') || '{}').id && '(Io)'}</TextStyle>
          </div>
          <div>
            <p>
              <TextStyle variation="subdued">Ruolo: {String(item.role).charAt(0).toUpperCase() + String(item.role).slice(1)}</TextStyle>
            </p>
          </div>
        </div>
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
  const paginationMarkup = items.length > 0
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
            { label: 'Data aggiunta utente (dal più recente)', value: 'DATE_CREATED_DESC' },
            { label: 'Data aggiunta utente (dal meno recente)', value: 'DATE_CREATED_ASC' },
          ]}
          onSortChange={(selected) => {
            setSortValue(selected);
          }}
          totalItemsCount={total}
        />
        {paginationMarkup}
      </Card>
    )
  }

  return customerListMarkup;
}