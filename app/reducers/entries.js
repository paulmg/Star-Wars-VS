import * as types from '../constants';

const entries = (state = {}, action) => {
  console.log(state)
  switch(action.type) {
    case types.SET_LEFT_RIGHT_ENTRIES:
      return {
        leftEntry: action.leftEntry,
        rightEntry: action.rightEntry,
        canVote: true
      };

    case types.CAN_VOTE:
      return {
        ...state,
        canVote: action.isEnabled
      };

    default:
      return state;
  }
};

export default entries;
