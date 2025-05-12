import * as types from '../actions/types';

const initialState = {
  isLoading: false,
  listFactories: [],
  factoryDetails: null,
  filterFactory: null,
  error: null,
};

export default function factoriesReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_FACTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.GET_ALL_FACTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        listFactories: action.payload,
      };
    case types.GET_ALL_FACTORY_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };

    case types.GET_BY_ID_FACTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.GET_BY_ID_FACTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        factoryDetails: action.payload,
      };
    case types.GET_BY_ID_FACTORY_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case types.SET_FFACTORY:
      return {
        ...state,
        factoryDetails: action.payload,
      };
    case types.SET_FACTORY_FILTER_VALUE:
      return {
        ...state,
        filterFactory: action.payload,
      };

    default:
      return state;
  }
}
