import * as types from './types';
import { polyfill } from 'es6-promise';
polyfill();

export const setWindowSize = (width) => ({
  type: types.SET_WINDOW_SIZE,
  payload: width,
});
