import {
  SET_USER_DATA,
  SET_USER_TOKEN,
  SAVE_DEPARTMENTS,
  SAVE_SELECTED_DEPARTMENT,
  POPUP_ACTIVATION,
  SET_ADD_ORDER_PAYLOAD,
  SAVE_NEW_ORDER_ID,
  UPDATE_IS_LOGIN,
  SAVE_SELECTED_MANAGER,
  SAVE_SELECTED_USER,
} from '../actions/types';

const initialState = {
  user: {},
  token: '',
  departments: [],
  selectedDepartment: { view: 'yearly', name: 'ריכוז הזמנות', _id: '' },
  addOrderPayload: {},
  lastAddedOrderId: '',
  popupActivation: true,
  isLogin: false,
  selectedManager: '',
  selectedUser: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    case SET_USER_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SAVE_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload,
      };
    case SAVE_SELECTED_DEPARTMENT:
      return {
        ...state,
        selectedDepartment: action.payload,
      };
    case POPUP_ACTIVATION:
      return {
        ...state,
        popupActivation: action.payload,
      };
    case SET_ADD_ORDER_PAYLOAD:
      return {
        ...state,
        addOrderPayload: action.payload,
      };
    case SAVE_NEW_ORDER_ID:
      return {
        ...state,
        lastAddedOrderId: action.payload,
      };
    case UPDATE_IS_LOGIN:
      return {
        ...state,
        isLogin: action.payload,
      };
    case SAVE_SELECTED_MANAGER:
      return {
        ...state,
        selectedManager: action.payload,
      };
    case SAVE_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };

    default:
      return state;
  }
}
