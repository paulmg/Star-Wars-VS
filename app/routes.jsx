import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import Layout from './pages/Layout';
import Main from './pages/Main';
import Films from './pages/Films';
import People from './pages/People';

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Main} />
    <IndexRedirect to="/films" />
    <Route path="films" component={Films} />
    <Route path="people" component={People} />
  </Route>
);
