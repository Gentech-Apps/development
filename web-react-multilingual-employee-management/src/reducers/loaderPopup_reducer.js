import { UPDATE_LOADER } from '../actions/types';

const initialState = {
  loaderPopup: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOADER:
      return {
        ...state,
        loaderPopup: action.payload,
      };
    default:
      return state;
  }
}
