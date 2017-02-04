import 'isomorphic-fetch';

import * as types from '../constants';

export function makeTopicRequest(method, id, data, api = '/topic') {
  return fetch[method](api + (id ? ('/' + id) : ''), data);
}

export function increment(id) {
  return { type: types.INCREMENT_COUNT, id };
}

export function decrement(id) {
  return { type: types.DECREMENT_COUNT, id };
}

export function destroy(id) {
  return { type: types.DESTROY_TOPIC, id };
}

export function createTopicFailure(data) {
  return {
    type: types.CREATE_TOPIC_FAILURE,
    id: data.id,
    error: data.error
  };
}

export function incrementCount(id) {
  return (dispatch) => {
    return makeTopicRequest('put', id, {
      isFull: false,
      isIncrement: true
    })
      .then(() => dispatch(increment(id)))
      .catch(() => dispatch(createTopicFailure({ id, error: 'Oops! Something went wrong and we couldn\'t add your vote' })));
  };
}

export function decrementCount(id) {
  return (dispatch) => {
    return makeTopicRequest('put', id, {
      isFull: false,
      isIncrement: false
    })
      .then(() => dispatch(decrement(id)))
      .catch(() => dispatch(createTopicFailure({ id, error: 'Oops! Something went wrong and we couldn\'t add your vote' })));
  };
}

export function destroyTopic(id) {
  return (dispatch) => {
    return makeTopicRequest('delete', id)
      .then(() => dispatch(destroy(id)))
      .catch(() => dispatch(createTopicFailure({
        id,
        error: 'Oops! Something went wrong and we couldn\'t add your vote'
      })));
  };
}
