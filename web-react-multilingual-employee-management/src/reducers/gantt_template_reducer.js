import * as types from '../actions/types';

const initialState = {
  loading: false,
  listProcesses: [],
  processesDetails: null,
  error: null,
  countProcesses: 0,
  currentPage: 0,
  rowsPerPage: 10,
};

export default function ganttTemplateReducer(state = initialState, action) {
  switch (action.type) {
    case types.GANTT_TEMPLATE_CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case types.GANTT_TEMPLATE_CHANGE_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.payload,
      };

    case types.ADMIN_GET_FILTER_PROCESSES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.ADMIN_GET_FILTER_PROCESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listProcesses: action.payload.result,
        countProcesses: action.payload.count,
      };
    case types.ADMIN_GET_FILTER_PROCESSES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_ALL_PROCESSES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_PROCESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listProcesses: action.payload,
      };
    case types.GET_ALL_PROCESSES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.PROCESS_GET_BY_FACTORY_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.PROCESS_GET_BY_FACTORY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listProcesses: action.payload,
      };
    case types.PROCESS_GET_BY_FACTORY_ID_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_BY_ID_PROCESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        processesDetails: action.payload,
      };
    case types.SET_PROCESS:
      return {
        ...state,
        processesDetails: action.payload,
      };

    default:
      return state;
  }
}
