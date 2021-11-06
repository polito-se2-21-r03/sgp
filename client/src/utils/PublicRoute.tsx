import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';

export default function PublicRoute({ component, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? React.createElement(component, props) : <Redirect to={{ pathname: '/' }} />}
    />
  )
}