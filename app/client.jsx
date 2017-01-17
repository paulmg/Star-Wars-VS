import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import 'isomorphic-fetch';

import * as types from './constants';
import configureStore from './store';
import preRenderMiddleware from './middlewares/preRenderMiddleware';
import routes from './routes';
import config from './config';

// Grab the state from a global injected into server-generated HTML
const initialState = window.__APOLLO_STATE__; // eslint-disable-line no-underscore-dangle

const token = config.apiToken;
const headers = { Authorization: `Bearer ${token}` };

const client = new ApolloClient({
  initialState,
  networkInterface: createNetworkInterface({
    uri: config.apiUrl,
    opts: {
      headers
    },
    // transportBatching: true
  }),
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
  // dataIdFromObject: o => o.id,
  ssrForceFetchDelay: 100
});

// const store = configureStore(initialState, browserHistory);
// const history = syncHistoryWithStore(browserHistory, store);
// const routes = createRoutes();

// function onUpdate() {
//   store.dispatch({ type: types.CREATE_REQUEST });
//   preRenderMiddleware(this.state)
//     .then((data) => {
//       return store.dispatch({ type: types.REQUEST_SUCCESS, data });
//     });
// }

render((
  <ApolloProvider client={client}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </ApolloProvider>),
  document.getElementById('app')
);
