import * as types from '../actions/types';

const ORDERS_LIMIT = 20;

const initialState = {
  loading: false,
  listOrders: [],
  ongoingOrders: [],
  ongoingOrdersLimit: ORDERS_LIMIT,
  ongoingOrdersCount: 0,
  orderDetails: null,
  error: null,
};

export default function adminOrdersReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrders: action.payload,
      };
    case types.GET_ALL_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_ONGOING_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ONGOING_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        ongoingOrdersCount: action.payload.count,
        ongoingOrders: [...state.ongoingOrders, ...action.payload.result],
      };
    case types.GET_ONGOING_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.ORDER_GET_BY_FACTORY_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ORDER_GET_BY_FACTORY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrders: action.payload,
      };
    case types.ORDER_GET_BY_FACTORY_ID_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_BY_ID_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        orderDetails: action.payload,
      };
    case types.SET_ORDER:
      return {
        ...state,
        orderDetails: action.payload,
      };

    default:
      return state;
  }
}
