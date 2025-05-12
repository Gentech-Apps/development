import { UPDATE_LOADER } from './types';
import { polyfill } from 'es6-promise';
polyfill();

export const upadteLoaderPopup = (boolean) => async (dispatch) => {
  dispatch({
    type: UPDATE_LOADER,
    payload: boolean,
  });
};
