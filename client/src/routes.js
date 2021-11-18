import { Dashboard, CustomerAll, ProductAll, Settings, Account, CustomerNew, ProductNew, ProductDetails, CustomerDetails, UserAll, UserNew, UserDetails, OrderAll, OrderNew, OrderDetails } from './pages';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, exact: true },
  /** Orders */
  { path: '/orders', name: 'Orders', component: OrderAll, exact: true },
  { path: '/orders/new', name: 'New Order', component: OrderNew, exact: true },
  { path: '/orders/:id', name: 'Order Details', component: OrderDetails, exact: true },
  /** Customers */
  { path: '/customers', name: 'Customers', component: CustomerAll, exact: true },
  { path: '/customers/new', name: 'New Customer', component: CustomerNew, exact: true },
  { path: '/customers/:id', name: 'Customer Details', component: CustomerDetails, exact: true },
  /** Products */
  { path: '/products', name: 'Products', component: ProductAll, exact: true },
  { path: '/products/new', name: 'New Product', component: ProductNew, exact: true },
  { path: '/products/:id', name: 'Product Details', component: ProductDetails, exact: true },
  /** Settings */
  { path: '/settings', name: 'Impostazioni', component: Settings, exact: true },
  // { path: '/settings/general', name: 'Generali', component: General, exact: true },
  { path: '/settings/account', name: 'Account', component: Account, exact: true },
  /** Admin */
  { path: '/admin/users', name: 'Utenti', roles: ['admin'], component: UserAll, exact: true },
  { path: '/admin/users/new', name: 'Nuovo utente', roles: ['admin'], component: UserNew, exact: true },
  { path: '/admin/users/:id', name: 'Utente', roles: ['admin'], component: UserDetails, exact: true },
];

export default routes;
