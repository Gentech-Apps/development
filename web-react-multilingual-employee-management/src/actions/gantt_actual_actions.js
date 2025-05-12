import * as types from './types';
import axios from 'axios';
import { api, createHeaders } from '../constants/api-urls';

export const changeCurrentPage = (page) => ({
  type: types.GANTT_ACTUAL_CHANGE_CURRENT_PAGE,
  payload: page,
});

export const changeRowsPerPage = (count) => ({
  type: types.GANTT_ACTUAL_CHANGE_ROWS_PER_PAGE,
  payload: count,
});

const getAllOrderProcessesRequest = () => ({
  type: types.GET_ALL_ORDER_PROCESSES_REQUEST,
});

const getAllOrderProcessesSuccess = (value) => ({
  type: types.GET_ALL_ORDER_PROCESSES_SUCCESS,
  payload: value,
});

const getAllOrderProcessesFailure = (error) => ({
  type: types.GET_ALL_ORDER_PROCESSES_ERROR,
  payload: {
    error,
  },
});

export const getAllOrderProcesses = (page, rowsPerPage) => {
  return (dispatch) => {
    dispatch(getAllOrderProcessesRequest());
    const params = { skip: page * rowsPerPage, limit: rowsPerPage };
    const url = `${api.admin.orderProcesses.allOrderProcesses(params)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getAllOrderProcessesSuccess(result));
      })
      .catch((err) => {
        dispatch(getAllOrderProcessesFailure(err.message));
      });
  };
};

const getByFilterOrderProcessesRequest = () => ({
  type: types.ADMIN_GET_FILTER_ORDER_PROCESSES_REQUEST,
});

const getByFilterOrderProcessesSuccess = (value) => ({
  type: types.ADMIN_GET_FILTER_ORDER_PROCESSES_SUCCESS,
  payload: value,
});

const getByFilterOrderProcessesFailure = (error) => ({
  type: types.ADMIN_GET_FILTER_ORDER_PROCESSES_ERROR,
  payload: {
    error,
  },
});

export const getByFilterOrderProcesses = (
  limit = 20,
  page = 0,
  sort = -1,
  factory_id,
  from,
  to,
  order_id,
  sub_department_id,
) => {
  return (dispatch) => {
    dispatch(getByFilterOrderProcessesRequest());
    let filter = `limit=${limit}&page=${page}&sort=${sort}
    ${factory_id ? `&factory_id=${factory_id}` : ``}
    ${from ? `&from=${from}` : ``}
    ${to ? `&to=${to}` : ``}
    ${order_id ? `&order_id=${order_id}` : ``}
    ${sub_department_id ? `&sub_department_id=${sub_department_id}` : ``}`;

    let url = `${api.admin.orderProcesses.getByFilter(filter)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, count } = res.data;
        dispatch(getByFilterOrderProcessesSuccess({ result: result, count: count }));
      })
      .catch((err) => {
        dispatch(getByFilterOrderProcessesFailure(err.message));
      });
  };
};

const getOrderProcessRequest = () => ({
  type: types.GET_BY_ID_ORDER_PROCESS_REQUEST,
});

const getOrderProcessSuccess = (value) => ({
  type: types.GET_BY_ID_ORDER_PROCESS_SUCCESS,
  payload: value,
});

const getOrderProcessFailure = (error) => ({
  type: types.GET_BY_ID_ORDER_PROCESS_ERROR,
  payload: {
    error,
  },
});

export const getOrderProcess = (id) => {
  return (dispatch) => {
    dispatch(getOrderProcessRequest());
    let url = `${api.admin.orderProcesses.getById(id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getOrderProcessSuccess(result));
      })
      .catch((err) => {
        dispatch(getOrderProcessFailure(err.message));
      });
  };
};

export const setOrderProcessDetais = (value) => {
  return {
    type: types.SET_ORDER_PROCESSES,
    payload: value,
  };
};

export const createOrderProcess = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(createOrderProcessRequest());
    let url = `${api.admin.orderProcesses.create}`;
    const headers = createHeaders();
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createOrderProcessSuccess(ok));
        dispatch(getOrderProcesses(filterFactory));
      })
      .catch((err) => {
        dispatch(createOrderProcessFailure(err.message));
      });
  };
};

const createOrderProcessRequest = () => ({
  type: types.ORDER_PROCESS_CREATE_REQUEST,
});

const createOrderProcessSuccess = (isCreate) => ({
  type: types.ORDER_PROCESS_CREATE_SUCCESS,
});

const createOrderProcessFailure = (error) => ({
  type: types.ORDER_PROCESS_CREATE_ERROR,
  payload: {
    error,
  },
});

export const updateOrderProcess = (data, filterFactory = null, page, rowsPerPage) => {
  return (dispatch) => {
    dispatch(updateOrderProcessRequest());
    let url = `${api.admin.orderProcesses.update}`;
    const headers = createHeaders();
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateOrderProcessSuccess(ok));
        dispatch(getOrderProcesses(filterFactory, page, rowsPerPage));
      })
      .catch((err) => {
        dispatch(updateOrderProcessFailure(err.message));
      });
  };
};

const updateOrderProcessRequest = () => ({
  type: types.ORDER_PROCESS_UPDATE_REQUEST,
});

const updateOrderProcessSuccess = (isUpdate) => ({
  type: types.ORDER_PROCESS_UPDATE_SUCCESS,
});

const updateOrderProcessFailure = (error) => ({
  type: types.ORDER_PROCESS_UPDATE_ERROR,
  payload: {
    error,
  },
});

const getOrderProcessesByFactoryRequest = () => ({
  type: types.ORDER_PROCESSES_GET_BY_FACTORY_ID_REQUEST,
});

const getOrderProcessesByFactorySuccess = (value) => ({
  type: types.ORDER_PROCESSES_GET_BY_FACTORY_ID_SUCCESS,
  payload: value,
});

const getOrderProcessesByFactoryFailure = (error) => ({
  type: types.ORDER_PROCESSES_GET_BY_FACTORY_ID_ERROR,
  payload: {
    error,
  },
});

export const getOrderProcessesByFactory = (factory_id) => {
  return (dispatch) => {
    dispatch(getOrderProcessesByFactoryRequest());
    let url = `${api.admin.orderProcesses.getByFactoryId(factory_id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getOrderProcessesByFactorySuccess(result));
      })
      .catch((err) => {
        dispatch(getOrderProcessesByFactoryFailure(err.message));
      });
  };
};

export const getOrderProcesses = (idFactoryId = null, page = 0, rowsPerPage = 10) => {
  return (dispatch) => {
    if (idFactoryId) {
      dispatch(getOrderProcessesByFactory(idFactoryId));
    } else {
      dispatch(getAllOrderProcesses(page, rowsPerPage));
    }
  };
};
