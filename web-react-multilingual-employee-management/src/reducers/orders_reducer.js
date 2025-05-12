import {
  SET_ORDERS_AND_WEEKS_DATA,
  ADD_ORDER_TO_ORDERS_DATA,
  CHANGE_PAGE_NUMBER_FOR_API,
  SET_ORDERS_DATA,
  CANCLE_BLOCK_RENDER,
  UPDATE_WARNING_POPUP,
  UPDATE_SPREAD_POPUP,
  UPDATE_ORDER_IN_UI,
  UPDATE_SPREAD_GREATER_OR_SMALLER,
  UPDATE_REASON_POPUP,
  ADD_NEW_ORDER_TO_THE_TOP,
  UPDATE_CONSTANT_POPUP,
  GET_RECIPIENT_REASONE,
  UPDATE_ORDER_ANNUAL_VIEW,
} from '../actions/types';
import { ORDERS_QUANTITY_START_PAGE } from '../constants/orders-pagination';

const initialState = {
  orders: [],
  page_number_for_api: 0,
  page: 0,
  order_per_page: ORDERS_QUANTITY_START_PAGE,
  weeks_array: [],
  warningPopup: false,
  spread_popup: false,
  reason_popup: false,
  is_greater_date: '',
  loaded: false,
  block: false,
  constant_popup: false,
  isRecipientReasone: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ORDERS_AND_WEEKS_DATA:
      return {
        ...state,
        orders: action.payload.orders_and_weeks.orders,
        weeks_array: action.payload.orders_and_weeks.weeks_array,
        loaded: true,
        block: action.payload.blockRender ? true : false,
      };
    case GET_RECIPIENT_REASONE:
      return {
        ...state,
        isRecipientReasone: action.payload,
      };
    case SET_ORDERS_DATA:
      return {
        ...state,
        orders: action.payload,
      };
    case ADD_ORDER_TO_ORDERS_DATA:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case CHANGE_PAGE_NUMBER_FOR_API:
      let new_page = state.page;
      if (action.payload === 0) {
        new_page = 0;
      } else {
        new_page++;
      }

      return {
        ...state,
        page_number_for_api: action.payload,
        page: new_page,
      };
    case UPDATE_WARNING_POPUP:
      return {
        ...state,
        warningPopup: action.payload,
      };
    case UPDATE_SPREAD_POPUP:
      return {
        ...state,
        spread_popup: action.payload,
      };
    case CANCLE_BLOCK_RENDER:
      return {
        ...state,

        block: false,
      };
    case UPDATE_SPREAD_GREATER_OR_SMALLER:
      return {
        ...state,
        is_greater_date: action.payload,
      };
    case UPDATE_REASON_POPUP:
      return {
        ...state,
        reason_popup: action.payload,
      };

    case UPDATE_ORDER_IN_UI:
      return {
        ...state,
      };
    case ADD_NEW_ORDER_TO_THE_TOP:
      //adding new order without dates change.
      let copy_orders = JSON.parse(JSON.stringify(state.orders));
      copy_orders = { [action.payload.id]: action.payload.data, ...copy_orders };

      return {
        ...state,
        orders: copy_orders,
      };
    case UPDATE_CONSTANT_POPUP:
      return {
        ...state,
        constant_popup: action.payload,
      };
    case UPDATE_ORDER_ANNUAL_VIEW:
      return {
        ...state,
        orders: { ...state.orders, ...action.payload },
      };

    default:
      return state;
  }
}
