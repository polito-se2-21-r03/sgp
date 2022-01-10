import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './utils/PrivateRoute';
import routes from './routes';

/** Pages */
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ForgotPasswordPage, RegisterPage, UnregisteredUserProductAll } from './pages';

function App() {
  const [vcDate, setVcDate] = useState(new Date().toISOString())

  // Function to add our give data into cache
  const addDataIntoCache = (cacheName: any, url: any, response: any) => {
    // Converting our respons into Actual Response form
    const data = new Response(JSON.stringify(response));

    if ('caches' in window) {
      // Opening given cache and putting our data into it
      caches.open(cacheName).then((cache) => {
        cache.put(url, data);
        alert('Data Added into cache!')
      });
    }
  };

  return (
    <div className="App">
      <Router >
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/reset-password" component={ForgotPasswordPage} />
          <Route exact path="/browse" component={UnregisteredUserProductAll} />
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
