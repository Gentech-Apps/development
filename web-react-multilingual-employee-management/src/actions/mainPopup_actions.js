import {
  SAVE_EDDITED_ORDER_ID_FOR_CONST_REPOSITION,
  SET_NEW_DUE_DATE_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP,
  SET_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP,
  SET_ORDER_DATA_TO_UPDATE_POPUP,
  SET_ORDER_ID_TO_UPDATE_POPUP,
  SHOW_POPUP,
  RESET_POPUP_DATA,
  SET_ORDER_AFTER_EDIT_FROM_CUSTOMERS_PAGE,
  SHOW_ORDER_POPUP,
  SET_ORDER_PROCESSES,
  SET_ORDER_PROCESSES_FOR_CUSTOMER_PAGE,
} from './types';
export const setOrderDataForPopup = (data) => async (dispatch) => {
  dispatch({
    type: SET_ORDER_DATA_TO_UPDATE_POPUP,
    payload: data,
  });
};

export const setOrderIdForPopup = (id) => async (dispatch) => {
  dispatch({
    type: SET_ORDER_ID_TO_UPDATE_POPUP,
    payload: id,
  });
};

export const showMainPopup = (boolean) => async (dispatch) => {
  dispatch({
    type: SHOW_POPUP,
    payload: boolean,
  });
};

export const showOrderPopup = (boolean) => async (dispatch) => {
  dispatch({
    type: SHOW_ORDER_POPUP,
    payload: boolean,
  });
};

export const resetPopupData = () => (dispatch) => {
  dispatch({
    type: RESET_POPUP_DATA,
  });
};

export const setOrderAfterEditFromPopup = (data) => async (dispatch) => {
  dispatch({
    type: SET_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP,
    payload: data,
  });
};

export const setNewDueDateAfterEditFromPopup = (date) => async (dispatch) => {
  dispatch({
    type: SET_NEW_DUE_DATE_ORDER_AFTER_EDIT_FROM_RESERVATION_POPUP,
    payload: date,
  });
};

export const saveEdditedOrderIdForConstantReposition = (order_id) => async (dispatch) => {
  dispatch({
    type: SAVE_EDDITED_ORDER_ID_FOR_CONST_REPOSITION,
    payload: order_id,
  });
};

export const setOrderUpdatedFromCustomersPage = (data) => async (dispatch) => {
  dispatch({
    type: SET_ORDER_AFTER_EDIT_FROM_CUSTOMERS_PAGE,
    payload: data,
  });
};

export const setOrderProcessForReservationPopup = (data) => async (dispatch) => {
  dispatch({
    type: SET_ORDER_PROCESSES_FOR_CUSTOMER_PAGE,
    payload: data,
  });
};
