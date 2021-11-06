import { Dashboard, DealerAll, CustomerAll, DealerDetails, BranchesAll, BranchesNew, CompaniesAll, CompaniesNew, ProductAll, Settings, Account, CustomerNew, ProductNew, ProductDetails, CustomerDetails, QuoteAll, QuoteNew, QuoteDetails, CompaniesDetails, ClaimAll, ClaimDetails, ClaimNew, UserAll, UserNew, UserDetails } from './pages';
import { NoteAll, NoteDetails, NoteNew } from './pages/Notes';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, exact: true },
  /** Dealers */
  { path: '/produttori', name: 'Produttori', component: DealerAll, exact: true },
  { path: '/produttori/:id', name: 'Produttore', component: DealerDetails, exact: true },
  /** Customers */
  { path: '/customers', name: 'Clienti', component: CustomerAll, exact: true },
  { path: '/customers/new', name: 'Nuovo cliente', component: CustomerNew, exact: true },
  { path: '/customers/:id', name: 'Dettagli cliente', component: CustomerDetails, exact: true },
  /** Products */
  { path: '/products', name: 'Polizze', component: ProductAll, exact: true },
  { path: '/products/new', name: 'Nuova Polizza', component: ProductNew, exact: true },
  { path: '/products/:id', name: 'Dettagli polizza', component: ProductDetails, exact: true },
  /** Quotes */
  { path: '/quotes', name: 'Polizze', component: QuoteAll, exact: true },
  { path: '/quotes/new', name: 'Nuova Polizza', component: QuoteNew, exact: true },
  { path: '/quotes/:id', name: 'Dettagli polizza', component: QuoteDetails, exact: true },
  /** Claims */
  { path: '/claims', name: 'Sinistri', component: ClaimAll, exact: true },
  { path: '/claims/new', name: 'Nuovo sinistro', component: ClaimNew, exact: true },
  { path: '/claims/:id', name: 'Dettagli sinistro', component: ClaimDetails, exact: true },
  /** Notes */
  { path: '/notes', name: 'Note', component: NoteAll, exact: true },
  { path: '/notes/new', name: 'Nuova nota', component: NoteNew, exact: true },
  { path: '/notes/:id', name: 'Dettagli nota', component: NoteDetails, exact: true },
  /** Settings */
  { path: '/settings', name: 'Impostazioni', component: Settings, exact: true },
  // { path: '/settings/general', name: 'Generali', component: General, exact: true },
  { path: '/settings/account', name: 'Account', component: Account, exact: true },
  // Branches
  { path: '/settings/branches', name: 'Rami', component: BranchesAll, exact: true },
  { path: '/settings/branches/new', name: 'Nuovo ramo', component: BranchesNew, exact: true },
  // Companies
  { path: '/settings/companies', name: 'Compagnie', component: CompaniesAll, exact: true },
  { path: '/settings/companies/new', name: 'Compagnie', component: CompaniesNew, exact: true },
  { path: '/settings/companies/:id', name: 'Dettagli compagnie', component: CompaniesDetails, exact: true },
  /** Admin */
  { path: '/admin/users', name: 'Utenti', roles: ['admin'], component: UserAll, exact: true },
  { path: '/admin/users/new', name: 'Nuovo utente', roles: ['admin'], component: UserNew, exact: true },
  { path: '/admin/users/:id', name: 'Utente', roles: ['admin'], component: UserDetails, exact: true },
];

export default routes;
