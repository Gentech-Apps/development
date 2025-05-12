import * as types from '../actions/types';

const initialState = {
  loading: false,
  listOrderCategories: [],
  orderCategoryDetails: null,
  error: null,
  countOrderCategories: 0,
  currentPage: 0,
  rowsPerPage: 10,
};

export default function orderСategoriesReducer(state = initialState, action) {
  switch (action.type) {
    case types.ORDER_CATEGORIES_CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case types.ORDER_CATEGORIES_CHANGE_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.payload,
      };

    case types.ADMIN_GET_FILTER_ORDER_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ADMIN_GET_FILTER_ORDER_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderCategories: action.payload.result,
        countOrderCategories: action.payload.count,
      };
    case types.ADMIN_GET_FILTER_ORDER_CATEGORIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case types.GET_ALL_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderCategories: action.payload,
      };
    case types.GET_ALL_CATEGORIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.ORDER_CATEGORIES_GET_BY_FACTORY_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ORDER_CATEGORIES_GET_BY_FACTORY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderCategories: action.payload,
      };
    case types.ORDER_CATEGORIES_GET_BY_FACTORY_ID_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_BY_ID_CATEGORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        orderCategoryDetails: action.payload,
      };
    case types.SET_ORDER_CATEGORY:
      return {
        ...state,
        orderCategoryDetails: action.payload,
      };
    default:
      return state;
  }
}
