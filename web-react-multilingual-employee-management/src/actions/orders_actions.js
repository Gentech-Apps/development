import {
  GET_RECIPIENT_REASONE,
  UPDATE_CONSTANT_POPUP,
  ADD_NEW_ORDER_TO_THE_TOP,
  SET_ORDERS_AND_WEEKS_DATA,
  UPDATE_ORDER_IN_UI,
  UPDATE_REASON_POPUP,
  UPDATE_SPREAD_GREATER_OR_SMALLER,
  UPDATE_SPREAD_POPUP,
  SET_ORDERS_DATA,
  ADD_ORDER_TO_ORDERS_DATA,
  CHANGE_PAGE_NUMBER_FOR_API,
  UPDATE_WARNING_POPUP,
  CANCLE_BLOCK_RENDER,
  UPDATE_ORDER_ANNUAL_VIEW,
} from './types';
import { polyfill } from 'es6-promise';
polyfill();

export const setOrdersAndWeeksData = (orders_and_weeks, blockRender) => async (dispatch) => {
  dispatch({
    type: SET_ORDERS_AND_WEEKS_DATA,
    payload: { orders_and_weeks, blockRender },
  });
};

export const getIsRecipientReasone = (boolean) => async (dispatch) => {
  dispatch({
    type: GET_RECIPIENT_REASONE,
    payload: boolean,
  });
};

export const setOrders = (orders) => async (dispatch) => {
  dispatch({
    type: SET_ORDERS_DATA,
    payload: orders,
  });
};

export const addOrder = (order) => async (dispatch) => {
  dispatch({
    type: ADD_ORDER_TO_ORDERS_DATA,
    payload: order,
  });
};

export const setPageNumberForGetOrders = (page_num) => async (dispatch) => {
  dispatch({
    type: CHANGE_PAGE_NUMBER_FOR_API,
    payload: page_num,
  });
};

export const updateWarningPopup = (boolean) => async (dispatch) => {
  dispatch({
    type: UPDATE_WARNING_POPUP,
    payload: boolean,
  });
};

export const cancelBlock = () => async (dispatch) => {
  dispatch({
    type: CANCLE_BLOCK_RENDER,
  });
};

export const updateSpreadPopup = (boolean) => async (dispatch) => {
  dispatch({
    type: UPDATE_SPREAD_POPUP,
    payload: boolean,
  });
};

export const updateReasonePopUp = (boolean) => async (dispatch) => {
  dispatch({
    type: UPDATE_REASON_POPUP,
    payload: boolean,
  });
};
export const isGreaterDate = (boolean) => async (dispatch) => {
  dispatch({
    type: UPDATE_SPREAD_GREATER_OR_SMALLER,
    payload: boolean,
  });
};

export const updateOrderInUI = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_ORDER_IN_UI,
    payload,
  });
};

export const addNewOrderTopList = (new_order) => async (dispatch) => {
  dispatch({
    type: ADD_NEW_ORDER_TO_THE_TOP,
    payload: new_order,
  });
};

export const updateConstantPopup = (boolean) => async (dispatch) => {
  dispatch({
    type: UPDATE_CONSTANT_POPUP,
    payload: boolean,
  });
};

export const updateOrderAnnualView = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_ORDER_ANNUAL_VIEW,
    payload: data,
  });
};
