import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import asyncLocalStorage from './async-localstorage';
import { verifyToken } from './Common';

export function PrivateRoute({ component: Compontent, path, roles, ...rest }: any) {

  const [auth, setAuth] = useState(false);
  const [goOn, setGoOn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    verifyToken()
      .then((res: any) => {
        setAuth(res.status);
        if (res.data)
          setUser(res.data.user)
      })
      .then(() => {
        setGoOn(true);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!goOn) {
    return (
      <div>Loading...</div>
    )
  }

  let res;

  const routesMap = new Map();
  routesMap.set('CLIENT', '/client');
  routesMap.set('FARMER', '/farmer');

  const getRoute = (role: string) => {
    if (routesMap.has(role))
      return routesMap.get(role);
    else
      return '/';
  }

  if (auth) {
    // @ts-ignore
    if (user.is_tmp_password) {
      res = <Route {...rest} render={props => <Redirect to={{ pathname: '/reset-password', state: { from: props.location } }} />} />
    } else {
      // @ts-ignore
      if ((roles && roles.includes(user.role)) || !roles)
        res = <Route {...rest} render={props => <Compontent path={props.location.pathname} user={user} {...props} />
        } />
      else
        // @ts-ignore
        res = <Route {...rest} render={props => <Redirect to={{ pathname: getRoute(user.role), state: { from: props.location } }} />} />
    }
  } else {
    res = <Route {...rest} render={props => <Redirect to={{ pathname: '/login', state: { from: props.location } }} />} />
  }

  return res;
}