import * as types from './types';
import axios from 'axios';
import { api, createHeaders } from '../constants/api-urls';
import { setCsvCustomer } from './csv_actions';

const getCustomersDataRequest = () => {
  return {
    type: types.GET_CUSTOMERS_INFO_REQUEST,
  };
};
const getCustomersDataSuccess = (data) => {
  return {
    type: types.GET_CUSTOMERS_INFO_SUCCESS,
    payload: data,
  };
};

const getCustomersDataError = (err) => {
  return {
    type: types.GET_CUSTOMERS_INFO_ERROR,
    error: err,
  };
};

export const getCustomersData = () => {
  return (dispatch) => {
    dispatch(getCustomersDataRequest());

    let url = `${api.customersPage.getCustomersDataRequest()}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, count } = res.data;
        dispatch(getCustomersDataSuccess({ result: result, count: count }));
        dispatch(setCsvCustomer(result));
      })
      .catch((err) => {
        dispatch(getCustomersDataError(err.message));
      });
  };
};

// add new customer

const createNewCustomerRequest = () => {
  return {
    type: types.CREATE_NEW_CUSTOMER_REQUEST,
  };
};
const createNewCustomerSuccess = (data) => {
  return {
    type: types.CREATE_NEW_CUSTOMER_SUCCESS,
    payload: data,
  };
};

const createNewCustomerError = (err) => {
  return {
    type: types.CREATE_NEW_CUSTOMER_ERROR,
    error: err,
  };
};

export const createOrEditCustomer = (data) => {
  return async (dispatch) => {
    dispatch(createNewCustomerRequest());

    let url = `${api.customersPage.createNewCustomerRequest()}`;
    const headers = createHeaders();
    return await axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createNewCustomerSuccess({ result: result }));
      })
      .catch((err) => {
        dispatch(createNewCustomerError(err.message));
      });
  };
};

// get customer info

const getCustomerInfoRequest = () => {
  return {
    type: types.GET_CUSTOMER_INFO_BY_ID_REQUEST,
  };
};

export const getCustomerInfoSuccess = (data) => {
  return {
    type: types.GET_CUSTOMER_INFO_BY_ID_SUCCESS,
    payload: data,
  };
};

const getCustomerInfoError = (err) => {
  return {
    type: types.GET_CUSTOMER_INFO_BY_ID_ERROR,
    payload: err,
  };
};

export const getCustomerInfoById = (id, system_view = 0) => {
  return async (dispatch) => {
    dispatch(getCustomerInfoRequest());
    let url = `${api.customersPage.getCustomerInfo(id)}`;
    const headers = createHeaders();
    return await axios
      .get(url, { headers })
      .then((res) => {
        const { result } = res.data;
        dispatch(getCustomerInfoSuccess({ result, system_view }));
      })
      .catch((err) => {
        dispatch(getCustomerInfoError(err.message));
      });
  };
};

export const resetCustomerData = () => {
  return {
    type: types.RESET_CUSTOMER_DATA,
  };
};

export const createNewOrderFromCustomersPageSuccess = (data) => {
  return {
    type: types.CREATE_NEW_ORDER_FROM_CUSTOMER_PAGE_SUCCESS,
    payload: data,
  };
};

export const setCustomerData = (data) => {
  return {
    type: types.SET_CUSTOMER_DATA,
    payload: data,
  };
};

export const setValueForCustomersFiltering = (data) => {
  return {
    type: types.SET_VALUE_FOR_CUSTOMERS_FILTERING,
    payload: data,
  };
};

export const setQueryForAutocomplete = (data) => {
  return {
    type: types.SET_QUERY_FOR_AUTOCOMPLETE,
    payload: data,
  };
};

export const setOptionsForAutocomplete = (data) => {
  return {
    type: types.SET_OPTIONS_FOR_AUTOCOMPLETE,
    payload: data,
  };
};

export const updateCustomerFirstLevelSystems = (systems) => {
  return {
    type: types.UPDATE_CUSTOMER_FIRST_LEVEL_SYSTEMS,
    payload: systems,
  };
};

export const setCallbackAndCredentialsForAddingSystem = (data) => {
  return {
    type: types.SET_CALLBACK_AND_CREDENTIALS_FOR_ADDING_SYSTEMS_FORM_CUSTOMER_PAGE,
    payload: data,
  };
};

export const setCustomerPageOrders = (data) => {
  return {
    type: types.SET_CUSTOMER_PAGE_ORDER,
    payload: data,
  };
};
