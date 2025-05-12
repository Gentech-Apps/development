import * as types from '../actions/types';

// const ORDERS_LIMIT = 20;

const initialState = {
  newSystem: null,
  doAdditionalTestsShown: false,
};

export default function adminSystemsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SYSTEM_CREATE_REQUEST:
      return {
        ...state,
        newSystem: null,
      };
    case types.SYSTEM_CREATE_SUCCESS:
      return {
        ...state,
        newSystem: action.payload,
      };
    case types.SYSTEM_CREATE_ERROR:
      return {
        ...state,
        newSystem: null,
      };

    case types.SYSTEM_SUCCESSFULLY_ADDED:
      return {
        ...state,
        newSystem: null,
      };
    // case types.SET_ADDITIONAL_TESTS_POPUP_ACTIVE:
    //   return{
    //     ...state,
    //     doAdditionalTestsShown: action.payload
    //   }
    default:
      return state;
  }
}
