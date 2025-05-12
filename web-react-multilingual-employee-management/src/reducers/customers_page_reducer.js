import * as types from '../actions/types';

const initialState = {
  error: null,
  loading: false,
  customerData: {},
  set_system_view: 0,
  customersList: null,
  createOrderFromCustomerPageResult: null,
  customersFilter: '',
  queryForAutocomplete: '',
  autocompleteOptions: [],
  layer: 1 /*1 is a default value for first layer */,
  updateSystems: null /*update systems callback */,
  parentSystemId: null /*expanded system id to be a parent system for newly created systems, "null" is a default value for first layer */,
  setCustomerOrders: [],
};

export default function customersPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_CUSTOMERS_INFO_REQUEST:
      return {
        ...state,
        // customersList: null,
        error: null,
        loading: true,
      };
    case types.GET_CUSTOMERS_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        customersList: action.payload.result,
      };
    case types.GET_CUSTOMERS_INFO_ERROR:
      return {
        ...state,
        loading: false,
        // customersList:null,
        error: action.payload.error,
      };
    case types.CREATE_NEW_CUSTOMER_REQUEST:
      return {
        ...state,
        // customersList: null,
        error: null,
        loading: true,
      };
    case types.CREATE_NEW_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        customersList: action.payload.result,
      };
    case types.CREATE_NEW_CUSTOMER_ERROR:
      return {
        ...state,
        loading: false,
        // customersList:null,
        error: action.payload.error,
      };
    case types.GET_CUSTOMER_INFO_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        customerData: action.payload.result,
        set_system_view: action.payload.system_view,
      };
    case types.GET_CUSTOMER_INFO_BY_ID_ERROR:
      return {
        ...state,
        loading: false,
        customerData: null,
        error: action.payload.error,
      };
    case types.GET_CUSTOMER_INFO_BY_ID_REQUEST:
      return {
        ...state,
        customerData: null,
        error: null,
        loading: true,
      };
    case types.RESET_CUSTOMER_DATA:
      return {
        ...state,
        customerData: null,
        error: null,
        loading: null,
      };
    case types.ADD_NEW_ACTUAL_SYSTEM_REQUEST:
      return {
        ...state,
        // customerData: null,
        error: null,
        loading: true,
      };
    case types.ADD_NEW_ACTUAL_SYSTEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        customerData: action.payload.result,
      };

    case types.ADD_NEW_ACTUAL_SYSTEM_ERROR:
      return {
        ...state,
        loading: false,
        // customerData:null,
        error: action.payload.error,
      };
    case types.EDIT_ACTUAL_SYSTEM_REQUEST:
      return {
        ...state,
        // customerData: null,
        error: null,
        loading: true,
      };
    case types.EDIT_ACTUAL_SYSTEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        customerData: action.payload.result,
      };

    case types.EDIT_ACTUAL_SYSTEM_ERROR:
      return {
        ...state,
        loading: false,
        // customerData:null,
        error: action.payload.error,
      };
    case types.DELETE_ACTUAL_SYSTEM_REQUEST:
      return {
        ...state,
        // customerData: null,
        error: null,
        loading: true,
      };
    case types.DELETE_ACTUAL_SYSTEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        customerData: action.payload.result,
      };

    case types.DELETE_ACTUAL_SYSTEM_ERROR:
      return {
        ...state,
        loading: false,
        // customerData:null,
        error: action.payload.error,
      };
    case types.CREATE_NEW_ORDER_FROM_CUSTOMER_PAGE_SUCCESS:
      return {
        ...state,
        createOrderFromCustomerPageResult: action.payload.order_id,
      };
    case types.SET_CUSTOMER_DATA:
      return {
        ...state,
        customerData: action.payload,
      };
    case types.SET_VALUE_FOR_CUSTOMERS_FILTERING:
      return {
        ...state,
        customersFilter: action.payload,
      };
    case types.SET_QUERY_FOR_AUTOCOMPLETE:
      return {
        ...state,
        queryForAutocomplete: action.payload,
      };
    case types.SET_OPTIONS_FOR_AUTOCOMPLETE:
      return {
        ...state,
        autocompleteOptions: action.payload,
      };
    case types.UPDATE_CUSTOMER_FIRST_LEVEL_SYSTEMS:
      const newCustomerData = { ...state.customerData };
      // newCustomerData.systems = [...state.customerData.systems, ...action.payload ]
      newCustomerData.systems = action.payload;
      return {
        ...state,
        customerData: newCustomerData,
      };
    case types.SET_CALLBACK_AND_CREDENTIALS_FOR_ADDING_SYSTEMS_FORM_CUSTOMER_PAGE:
      const { updateSystems, parentSystemId, layer } = action.payload;
      return {
        ...state,
        updateSystems,
        parentSystemId,
        layer,
      };
    case types.SET_CUSTOMER_PAGE_ORDER:
      state.setCustomerOrders = action.payload;
      return state;
    // case types.SET_FIRST_LAYER_SYSTEMS:
    //   const customerDataWithNewSystems = {
    //     ...state.customerData,
    //     systems: action.payload
    //   }
    //   return {
    //     ...state,
    //     customerData: customerDataWithNewSystems
    //   }

    default:
      return state;
  }
}
