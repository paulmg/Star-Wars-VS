import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import createRootReducer from '../reducers';
import config from '../config';

export default function configureStore(client, initialState, history) {
  // Installs hooks that always keep react-router and redux store in sync
  const middleware = [thunk, routerMiddleware(history), client.middleware()];
  let store;

  const rootReducer = createRootReducer(client);

  if(config.isClient && config.isDebug) {
    console.log('client')
    middleware.push(createLogger());
    store = createStore(rootReducer, initialState, compose(
      applyMiddleware(...middleware),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    ));
  } else {
    store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), f => f));
  }

  if(module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
