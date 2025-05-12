import { SHOW_BIDS_TOGGLE, UPDATE_PROCESS, FIRST_UNCOMPLETE_PROCESS_TOGGLE } from './types';
import { polyfill } from 'es6-promise';
import { upadteLoaderPopup } from './loaderPopup_action';
polyfill();

export const update_process_obj = (update_obj) => async (dispatch) => {
  dispatch({
    type: UPDATE_PROCESS,
    payload: update_obj,
  });
};

export const firstUncompleteProcessToggle = () => async (dispatch) => {
  dispatch({
    type: FIRST_UNCOMPLETE_PROCESS_TOGGLE,
  });
};

export const bidsToggle = () => async (dispatch) => {
  dispatch({
    type: SHOW_BIDS_TOGGLE,
  });
};
