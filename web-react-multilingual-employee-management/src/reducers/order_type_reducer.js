import * as types from '../actions/types';

const initialState = {
  loading: false,
  listOrderTypes: [],
  orderTypeDetails: null,
  error: null,
  countOrderTypes: 0,
  currentPage: 0,
  rowsPerPage: 10,
};

export default function orderTypeReducer(state = initialState, action) {
  switch (action.type) {
    case types.ORDER_TYPES_CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case types.ORDER_TYPES_CHANGE_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.payload,
      };

    case types.ADMIN_GET_FILTER_ORDER_TYPES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ADMIN_GET_FILTER_ORDER_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderTypes: action.payload.result,
        countOrderTypes: action.payload.count,
      };
    case types.ADMIN_GET_FILTER_ORDER_TYPES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case types.GET_ALL_ORDER_TYPES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_ORDER_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderTypes: action.payload,
      };
    case types.GET_ALL_ORDER_TYPES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.ORDER_TYPES_GET_BY_FACTORY_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ORDER_TYPES_GET_BY_FACTORY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderTypes: action.payload,
      };
    case types.ORDER_TYPES_GET_BY_FACTORY_ID_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_BY_ID_ORDER_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        orderTypeDetails: action.payload,
      };
    case types.SET_ORDER_TYPE:
      return {
        ...state,
        orderTypeDetails: action.payload,
      };
    default:
      return state;
  }
}
