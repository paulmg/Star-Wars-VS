import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import entries from './entries';
import isFetching from './fetching';

// Combine reducers with routeReducer which keeps track of router state
export default function createRootReducer(client) {
  return combineReducers({
    isFetching,
    entries,
    routing,
    apollo: client.reducer()
  });
}
