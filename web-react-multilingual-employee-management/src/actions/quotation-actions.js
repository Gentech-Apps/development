import * as types from './types';

export const setCustomerInfo = (data) => {
  return {
    type: types.SET_CUSTOMER_INFO,
    payload: data,
  };
};

export const setQuoteInfoData = (data) => {
  return {
    type: types.SET_QUOTE_DATA,
    payload: data,
  };
};

export const setActiveLocation = (data) => {
  // set location index for new product
  return {
    type: types.SET_ACTIVE_LOCATION,
    payload: data,
  };
};

export const createProduct = (data) => {
  // affer fill out create product form update products with newly created product
  return {
    type: types.CREATE_PRODUCT,
    payload: data,
  };
};
export const clearQuoteData = () => {
  return {
    type: types.CLEAR_QUOTE_DATA,
  };
};

export const setTotalAmount = (data) => {
  return {
    type: types.SET_TOTAL_AMOUNT,
    payload: data,
  };
};

export const setTotalProductsQuantity = (data) => {
  return {
    type: types.SET_PRODUCTS_QUANTITY,
    payload: data,
  };
};

export const setEditingStatus = (data) => {
  return {
    type: types.SET_EDITING_STATUS,
    payload: data,
  };
};

export const setPrintActive = (data) => {
  return {
    type: types.SET_PRINT_ACTIVE,
    payload: data,
  };
};

export const setQuoteInfoWasUpdated = (data) => {
  return {
    type: types.SET_QUOTE_INFO_WAS_CHANGED,
    payload: data,
  };
};
