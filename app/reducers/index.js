import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import topic from './topic';
import isFetching from './fetching';

// Combine reducers with routeReducer which keeps track of router state
export default function createRootReducer(client) {
  return combineReducers({
    isFetching,
    topic,
    routing,
    apollo: client.reducer()
  });
}
