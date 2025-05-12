import * as types from '../actions/types';

const initialState = {
  loading: false,
  listOrderProcesses: [],
  countOrderProcesses: 0,
  orderProcessesDetails: null,
  error: null,
  currentPage: 0,
  rowsPerPage: 10,
};

export default function ganttActualReducer(state = initialState, action) {
  switch (action.type) {
    case types.GANTT_ACTUAL_CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case types.GANTT_ACTUAL_CHANGE_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.payload,
      };

    case types.GET_ALL_ORDER_PROCESSES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_ORDER_PROCESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderProcesses: action.payload,
      };
    case types.GET_ALL_ORDER_PROCESSES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case types.ADMIN_GET_FILTER_ORDER_PROCESSES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ADMIN_GET_FILTER_ORDER_PROCESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderProcesses: action.payload.result,
        countOrderProcesses: action.payload.count,
      };
    case types.ADMIN_GET_FILTER_ORDER_PROCESSES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.ORDER_PROCESSES_GET_BY_FACTORY_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ORDER_PROCESSES_GET_BY_FACTORY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listOrderProcesses: action.payload,
      };
    case types.ORDER_PROCESSES_GET_BY_FACTORY_ID_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_BY_ID_ORDER_PROCESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        orderProcessesDetails: action.payload,
      };
    case types.SET_ORDER_PROCESSES:
      return {
        ...state,
        orderProcessesDetails: action.payload,
      };

    default:
      return state;
  }
}
