import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './utils/PrivateRoute';
import routes from './routes';

/** Pages */
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ForgotPasswordPage, RegisterPage } from './pages';

function App() {
  return (
    <div className="App">
      <Router >
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          {routes.map((route, idx) => {
            return route.component && (
              <PrivateRoute
                key={idx}
                path={route.path}
                exact={route.exact}
                //@ts-ignore
                roles={route.roles}
                component={route.component}
              />
            )
          })}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
