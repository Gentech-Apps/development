import { ALERT_POPUP_TOGGLE, SET_ALERT_POPUP_MESSAGE } from '../actions/types';

const initialState = {
  alert_message: '',
  show_popup: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ALERT_POPUP_TOGGLE:
      return {
        ...state,
        show_popup: action.payload,
      };
    case SET_ALERT_POPUP_MESSAGE:
      return {
        ...state,
        alert_message: action.payload,
      };
    default:
      return state;
  }
}
