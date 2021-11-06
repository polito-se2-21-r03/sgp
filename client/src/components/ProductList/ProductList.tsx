// @ts-nocheck

import { Card, EmptyState, Badge, Filters, TextStyle, IndexTable, Link, Select, useIndexResourceState } from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';

export function ProductList() {
  const [queryValue, setQueryValue] = useState(null);
  const [taggedWith, setTaggedWith] = useState(null);
  const [sortValue, setSortValue] = useState('DATE_CREATED_DESC');
  const [items, setItems] = useState([]);
  const [frontItems, setFrontItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const resourceName = {
    singular: 'polizza',
    plural: 'polizze',
  };

  const promotedBulkActions = [
    {
      content: 'Modifica polizze',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  /**
   * Data fetching
   */
  useEffect(() => {
    let customers = [];
    const branchesMap = new Map();

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
          let tmp = [];
          for (const item of response.data) {
            tmp.push({ id: item._id, name: item.name });
          }
          // @ts-ignore
          customers = tmp;
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchClients();

    // Fetch Branches
    const fetchBranches = async () => {
      try {
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/branches', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          for (const item of response.data) {
            branchesMap.set(item._id, item.label);
          }
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
    fetchBranches();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/products', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const response = await data.json();

        if (response.status === 'success') {
          let tmp = [];
          for (const item of response.data) {
            const itemCustomer = item.customer_id;
            const itemDealer = item.dealer_id;
            let customerName = '';
            let dealerName = '';

            customers.forEach((customer) => {
              if (customer.id === itemCustomer)
                customerName = customer.name;
            });

            item.branch_id = branchesMap.get(item.branch_id);

            tmp.push({ ...item, dealer: dealerName, customer: customerName });
          }
          setItems(tmp);
          setFrontItems(tmp);
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
        return item.customer.toLowerCase().includes(queryValue ? queryValue.toLowerCase() : '');
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
    if (sortValue === 'PREMIOTOT_ASC') {
      const tmp = [...frontItems];
      // @ts-ignore
      tmp.sort((a, b) => a.premio_netto - b.premio_netto);
      setFrontItems(tmp);
    } else if (sortValue === 'PREMIOTOT_DESC') {
      const tmp = [...frontItems];
      // @ts-ignore
      tmp.sort((a, b) => b.premio_netto - a.premio_netto);
      setFrontItems(tmp);
    } else if (sortValue === 'PROVV_ASC') {
      const tmp = [...frontItems];
      // @ts-ignore
      tmp.sort((a, b) => a.provvtotali - b.provvtotali);
      setFrontItems(tmp);
    } else if (sortValue === 'PROVV_DESC') {
      const tmp = [...frontItems];
      // @ts-ignore
      tmp.sort((a, b) => b.provvtotali - a.provvtotali);
      setFrontItems(tmp);
    } else if (sortValue === 'DATE_CREATED_ASC') {
      const tmp = [...frontItems];
      // @ts-ignore
      tmp.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
      setFrontItems(tmp);
    } else if (sortValue === 'DATE_CREATED_DESC') {
      const tmp = [...frontItems];
      // @ts-ignore
      tmp.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
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
      const str = item.status.charAt(0).toUpperCase() + item.status.slice(1);
      let statusMarkup;
      if (item.status === 'annullata') {
        statusMarkup = (
          <Badge status="critical" progress="incomplete">{str}</Badge>
        );
      } else if (item.status === 'agli atti legali') {
        statusMarkup = (
          <Badge status="critical" progress="incomplete">{str}</Badge>
        );
      } else if (item.status === 'disdettata') {
        statusMarkup = (
          <Badge progress="complete">{str}</Badge>
        );
      } else if (item.status === 'in vigore') {
        statusMarkup = (
          <Badge status="success" progress="complete">{str}</Badge>
        );
      } else if (item.status === 'sostituita') {
        statusMarkup = (
          <Badge status="attention" progress="complete">{str}</Badge>
        );
      }

      return (
        <IndexTable.Row
          id={item._id}
          key={item._id}
          selected={selectedResources.includes(item._id)}
          position={index}
        >
          <IndexTable.Cell>
            <TextStyle variation="strong">
              <Link url={`/products/${item._id}`} removeUnderline monochrome passHref data-primary-link>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  data-primary-link>
                  {item.customer}
                </a>
              </Link>
            </TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>{statusMarkup}</IndexTable.Cell>
          <IndexTable.Cell>{item.branch_id}</IndexTable.Cell>
          <IndexTable.Cell>{item.customer}</IndexTable.Cell>
          <IndexTable.Cell>{Number(item.premio_lordo).toFixed(2)} €</IndexTable.Cell>
          <IndexTable.Cell>{(Number(item.provvtotali / 100) * Number(item.premio_netto)).toFixed(2)} €</IndexTable.Cell>
        </IndexTable.Row>
      )
    }
  );

  const emptyList = (
    <EmptyState
      heading="Gestisci il portafoglio"
      image="https://cdn.shopify.com/shopifycloud/web/assets/v1/e7b58a8b2e612fe6cf6f8c9e53830b70.svg"
    >
      <p>
        Qua è dove puoi gestire il tuo portafoglio
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
              { label: 'Data aggiunta polizza (dalla più recente)', value: 'DATE_CREATED_DESC' },
              { label: 'Data aggiunta polizza (dalla meno recente)', value: 'DATE_CREATED_ASC' },
              { label: 'Premio crescente', value: 'PREMIOTOT_ASC' },
              { label: 'Premio decrescente', value: 'PREMIOTOT_DESC' },
              { label: 'Provvigioni crescenti', value: 'PROVV_ASC' },
              { label: 'Provvigioni decrescenti', value: 'PROVV_DESC' },
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
        promotedBulkActions={promotedBulkActions}
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'Cliente' },
          { title: 'Stato' },
          { title: 'Ramo' },
          { title: 'Scadenza' },
          { title: 'Premio Lordo' },
          { title: 'Provvigioni' },
        ]}
        sort
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  )

  return customerListMarkup;
}