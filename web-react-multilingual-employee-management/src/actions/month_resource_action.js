import * as types from './types';

export const updateLoader = (data) => {
  return {
    type: types.UPDATE_MONTH_RESOURCE_LOADER,
    payload: data,
  };
};

export const simpleDatesUpdate = (data) => {
  return {
    type: types.UPDATE_MONTH_RESOURCE_SIMPLE_DATE,
    payload: data,
  };
};

export const updateCalenderFlag = (data) => {
  return {
    type: types.MONTH_RESOURCE_CALENDER_UPDATE,
    payload: data,
  };
};

export const updateState = (data) => {
  return {
    type: types.MONTH_GLOBAL_STATE_MANAGER,
    payload: data,
  };
};

export const updateMonthResourceApi = (data) => {
  return {
    type: types.MONTH_UPDATE_API,
    payload: data,
  };
};

export const updateDataCheckList = (data) => {
  return {
    type: types.CUSTOMER_CHECK_LIST,
    payload: data,
  };
};
