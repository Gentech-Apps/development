import * as types from '../actions/types';

const initialState = {
  loading: false,
  listCollectionStages: [],
  orderCollectionStageDetails: null,
  error: null,
  countOrderCollectionStages: 0,
  currentPage: 0,
  rowsPerPage: 10,
};

export default function orderCollectionStagesReducer(state = initialState, action) {
  switch (action.type) {
    case types.ORDER_COLLECTION_STAGES_CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case types.ORDER_COLLECTION_STAGES_CHANGE_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.payload,
      };

    case types.ADMIN_GET_FILTER_ORDER_COLLECTION_STAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ADMIN_GET_FILTER_ORDER_COLLECTION_STAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listCollectionStages: action.payload.result,
        countOrderCollectionStages: action.payload.count,
      };
    case types.ADMIN_GET_FILTER_ORDER_COLLECTION_STAGES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    // case types.GET_ALL_ORDER_TYPES_REQUEST:
    //   return {
    //     ...state,
    //     loading: true,
    //   };
    // case types.GET_ALL_ORDER_TYPES_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: null,
    //     listCollectionStages: action.payload,
    //   };
    // case types.GET_ALL_ORDER_TYPES_ERROR:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.payload.error,
    //   };

    // case types.ORDER_TYPES_GET_BY_FACTORY_ID_REQUEST:
    //   return {
    //     ...state,
    //     loading: true,
    //   };
    // case types.ORDER_TYPES_GET_BY_FACTORY_ID_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: null,
    //     listCollectionStages: action.payload,
    //   };
    // case types.ORDER_TYPES_GET_BY_FACTORY_ID_ERROR:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.payload.error,
    //   };

    case types.GET_BY_ID_ORDER_COLLECTION_STAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        orderCollectionStageDetails: action.payload,
      };
    case types.SET_ORDER_COLLECTION_STAGES:
      return {
        ...state,
        orderCollectionStageDetails: action.payload,
      };
    default:
      return state;
  }
}
