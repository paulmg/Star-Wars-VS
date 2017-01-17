import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from './pages/Layout';
import Main from './pages/Main';
import Films from './pages/Films';

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Main} />
    <Route path="films" component={Films} />
  </Route>
);
