import * as types from '../constants';

import { getLeftRightIndexes } from '../utils/helpers';

export const setLeftRightEntries = (entries) => {
  const { leftIndex, rightIndex } = getLeftRightIndexes(entries.length);

  return {
    type: types.SET_LEFT_RIGHT_ENTRIES,
    leftEntry: entries[leftIndex],
    rightEntry: entries[rightIndex]
  };
};

export const setCanVote = (isEnabled) => {
  return {
    type: types.CAN_VOTE,
    isEnabled
  };
};
