import {
  SAVE_SELECTED_MANAGER,
  SET_USER_DATA,
  UPDATE_IS_LOGIN,
  SET_USER_TOKEN,
  SAVE_DEPARTMENTS,
  SAVE_SELECTED_DEPARTMENT,
  POPUP_ACTIVATION,
  SET_ADD_ORDER_PAYLOAD,
  SAVE_NEW_ORDER_ID,
  SAVE_SELECTED_USER,
} from './types';
import { polyfill } from 'es6-promise';
polyfill();
export const setUserData = (data) => async (dispatch) => {
  dispatch({
    type: SET_USER_DATA,
    payload: data,
  });
};

export const setUserToken = (token) => async (dispatch) => {
  dispatch({
    type: SET_USER_TOKEN,
    payload: token,
  });
};

export const saveDepartments = (payload) => (dispatch) => {
  dispatch({
    type: SAVE_DEPARTMENTS,
    payload,
  });
};

export const saveSelectedDepartment = (payload) => (dispatch) => {
  dispatch({
    type: SAVE_SELECTED_DEPARTMENT,
    payload,
  });
};

export const popupActivationConfig = (payload) => (dispatch) => {
  dispatch({
    type: POPUP_ACTIVATION,
    payload,
  });
};

export const setAddOrderPayload = (payload) => (dispatch) => {
  dispatch({
    type: SET_ADD_ORDER_PAYLOAD,
    payload,
  });
};

export const saveNewOrder = (payload) => (dispatch) => {
  dispatch({
    type: SAVE_NEW_ORDER_ID,
    payload,
  });
};

export const updateLogin = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_IS_LOGIN,
    payload,
  });
};

export const saveSelectedManager = (payload) => (dispatch) => {
  dispatch({
    type: SAVE_SELECTED_MANAGER,
    payload,
  });
};

export const saveSelectedResource = (payload) => (dispatch) => {
  dispatch({
    type: SAVE_SELECTED_USER,
    payload,
  });
};
