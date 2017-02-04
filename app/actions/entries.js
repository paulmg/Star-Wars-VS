import * as types from '../constants';

export function setLeftRightEntries(entries) {
  return { type: types.SET_LEFT_RIGHT_ENTRIES, entries };
}
