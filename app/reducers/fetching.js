import * as types from '../constants';

const isFetching = (state = false, action) => {
  switch(action.type) {
    case types.CREATE_REQUEST:
      return true;
    case types.REQUEST_SUCCESS:
    case types.REQUEST_FAILURE:
      return false;

    default:
      return state;
  }
};

export default isFetching;
