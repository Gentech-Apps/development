import {
  SET_ORDER_DATA_TO_UPDATE_POPUP,
  SET_ORDER_ID_TO_UPDATE_POPUP,
  SHOW_POPUP,
  RESET_POPUP_DATA,
  SET_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP,
  SET_NEW_DUE_DATE_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP,
  SAVE_EDDITED_ORDER_ID_FOR_CONST_REPOSITION,
  SET_ORDER_AFTER_EDIT_FROM_CUSTOMERS_PAGE,
  SHOW_ORDER_POPUP,
  SET_ORDER_PROCESSES_FOR_CUSTOMER_PAGE,
} from '../actions/types';

const initialState = {
  current_steps: {},
  order_id: '',
  order_data: {},
  show_popup: false,
  new_order: {},
  order_after_edit_from_reservation_popup: {},
  new_due_date_after_edit_from_reservation_popup: '',
  eddited_order_id: '',
  edditedFromCustomersPage: null,
  show_order_popup: false,
  order_process: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ORDER_DATA_TO_UPDATE_POPUP:
      return {
        ...state,
        order_data: action.payload,
        current_steps: action.payload.collection_stages,
        open_popup: true,
      };
    case SET_ORDER_ID_TO_UPDATE_POPUP:
      return {
        ...state,
        order_id: action.payload,
      };
    case SHOW_POPUP:
      return {
        ...state,
        show_popup: action.payload,
      };
    case SHOW_ORDER_POPUP:
      return {
        ...state,
        show_order_popup: action.payload,
      };
    case SET_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP:
      return {
        ...state,
        order_after_edit_from_reservation_popup: action.payload,
      };
    case SET_NEW_DUE_DATE_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP:
      return {
        ...state,
        new_due_date_after_edit_from_reservation_popup: action.payload,
      };
    case SAVE_EDDITED_ORDER_ID_FOR_CONST_REPOSITION:
      return {
        ...state,
        eddited_order_id: action.payload,
      };
    case SET_ORDER_AFTER_EDIT_FROM_CUSTOMERS_PAGE:
      return {
        ...state,
        edditedFromCustomersPage: action.payload,
      };

    case SET_ORDER_PROCESSES_FOR_CUSTOMER_PAGE:
      return {
        ...state,
        order_process: action.payload,
      };

    case RESET_POPUP_DATA:
      return initialState;
    default:
      return state;
  }
}
