import * as types from '../actions/types';

const initialState = {
  loading: false,
  listDepartments: [],
  departmentDetails: null,
  error: null,
  filterDepartment: null,
  countDepartment: 0,
  currentPage: 0,
  rowsPerPage: 10,
};

export default function departmentsReducer(state = initialState, action) {
  switch (action.type) {
    case types.DEPARTMENT_CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case types.DEPARTMENT_CHANGE_ROWS_PER_PAGE:
      return {
        ...state,
        rowsPerPage: action.payload,
      };

    case types.ADMIN_GET_FILTER_DEPARTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.ADMIN_GET_FILTER_DEPARTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listDepartments: action.payload.result,
        countDepartment: action.payload.count,
      };
    case types.ADMIN_GET_FILTER_DEPARTMENT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_ALL_DEPARTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_DEPARTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listDepartments: action.payload,
      };
    case types.GET_ALL_DEPARTMENT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.DEPARTMENT_GET_BY_FACTORY_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.DEPARTMENT_GET_BY_FACTORY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listDepartments: action.payload,
      };
    case types.DEPARTMENT_GET_BY_FACTORY_ID_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.GET_BY_ID_DEPARTMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        departmentDetails: action.payload,
      };
    case types.SET_DEPARTMENT:
      return {
        ...state,
        departmentDetails: action.payload,
      };

    case types.SET_DEPARTMENT_FILTER_VALUE:
      return {
        ...state,
        filterDepartment: action.payload,
      };
    default:
      return state;
  }
}
