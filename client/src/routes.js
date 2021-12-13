import {
  Dashboard,
  CustomerAll,
  ProductAll,
  Settings,
  Account,
  CustomerNew,
  ProductNew,
  ProductDetails,
  CustomerDetails,
  UserAll,
  UserNew,
  UserDetails,
  OrderAll,
  OrderNew,
  OrderDetails,
  ClientsProductAll,
  FarmersProductAll,
  UnregisteredUserProductAll,
} from "./pages";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    roles: ["ADMIN", "EMPLOYEE"],
    component: Dashboard,
    exact: true,
  },
  /** Orders */
  {
    path: "/orders",
    name: "Orders",
    roles: ["ADMIN", "EMPLOYEE"],
    component: OrderAll,
    exact: true,
  },
  {
    path: "/orders/new",
    name: "New Order",
    roles: ["ADMIN", "EMPLOYEE"],
    component: OrderNew,
    exact: true,
  },
  {
    path: "/orders/:id",
    name: "Order Details",
    roles: ["ADMIN", "EMPLOYEE"],
    component: OrderDetails,
    exact: true,
  },
  /** Customers */
  {
    path: "/customers",
    name: "Customers",
    roles: ["ADMIN", "EMPLOYEE"],
    component: CustomerAll,
    exact: true,
  },
  {
    path: "/customers/new",
    name: "New Customer",
    roles: ["ADMIN", "EMPLOYEE"],
    component: CustomerNew,
    exact: true,
  },
  {
    path: "/customers/:id",
    name: "Customer Details",
    roles: ["ADMIN", "EMPLOYEE"],
    component: CustomerDetails,
    exact: true,
  },
  /** Products */
  {
    path: "/products",
    name: "Products",
    roles: ["ADMIN", "EMPLOYEE"],
    component: ProductAll,
    exact: true,
  },
  {
    path: "/products/new",
    name: "New Product",
    roles: ["ADMIN", "EMPLOYEE"],
    component: ProductNew,
    exact: true,
  },
  {
    path: "/products/:id",
    name: "Product Details",
    roles: ["ADMIN", "EMPLOYEE"],
    component: ProductDetails,
    exact: true,
  },
  /** Settings */
  {
    path: "/settings",
    name: "Impostazioni",
    roles: ["ADMIN", "EMPLOYEE"],
    component: Settings,
    exact: true,
  },
  // { path: '/settings/general', name: 'Generali', component: General, exact: true },
  {
    path: "/settings/account",
    name: "Account",
    roles: ["ADMIN", "EMPLOYEE"],
    component: Account,
    exact: true,
  },
  /** Admin */
  {
    path: "/admin/users",
    name: "Utenti",
    roles: ["admin"],
    component: UserAll,
    exact: true,
  },
  {
    path: "/admin/users/new",
    name: "Nuovo utente",
    roles: ["admin"],
    component: UserNew,
    exact: true,
  },
  {
    path: "/admin/users/:id",
    name: "Utente",
    roles: ["admin"],
    component: UserDetails,
    exact: true,
  },
  /** Client */
  {
    path: "/client",
    name: "Cliente",
    roles: ["CLIENT"],
    component: ClientsProductAll,
    exact: true,
  },
  /** Farmers */
  {
    path: "/farmer",
    name: "Farmer",
    roles: ["FARMER"],
    component: FarmersProductAll,
    exact: true,
  },
  {
    path: "/farmer/orders",
    name: "Farmer",
    roles: ["FARMER"],
    component: OrderAll,
    exact: true,
  },
];

export default routes;
