import * as types from './types';
import axios from 'axios';
import { api, createHeaders } from '../constants/api-urls';

export const changeCurrentPage = (page) => ({
  type: types.ORDER_TYPES_CHANGE_CURRENT_PAGE,
  payload: page,
});

export const changeRowsPerPage = (count) => ({
  type: types.ORDER_TYPES_CHANGE_ROWS_PER_PAGE,
  payload: count,
});

const getAllOrderTypeRequest = () => ({
  type: types.GET_ALL_ORDER_TYPES_REQUEST,
});

const getAllOrderTypeSuccess = (value) => ({
  type: types.GET_ALL_ORDER_TYPES_SUCCESS,
  payload: value,
});

const getAllOrderTypeFailure = (error) => ({
  type: types.GET_ALL_ORDER_TYPES_ERROR,
  payload: {
    error,
  },
});

export const getAllOrderType = () => {
  return (dispatch) => {
    dispatch(getAllOrderTypeRequest());
    let url = `${api.admin.orderTypes.allOrderTypes}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getAllOrderTypeSuccess(result));
      })
      .catch((err) => {
        dispatch(getAllOrderTypeFailure(err.message));
      });
  };
};

const getByFilterOrderTypesRequest = () => ({
  type: types.ADMIN_GET_FILTER_ORDER_TYPES_REQUEST,
});

const getByFilterOrderTypesSuccess = (value) => ({
  type: types.ADMIN_GET_FILTER_ORDER_TYPES_SUCCESS,
  payload: value,
});

const getByFilterOrderTypesFailure = (error) => ({
  type: types.ADMIN_GET_FILTER_ORDER_TYPES_ERROR,
  payload: {
    error,
  },
});

export const getByFilterOrderTypes = (limit = 20, page = 0, sort = -1, factory_id) => {
  return (dispatch) => {
    dispatch(getByFilterOrderTypesRequest());
    let filter = `limit=${limit}&page=${page}&sort=${sort}${
      factory_id ? `&factory_id=${factory_id}` : ``
    }`;

    let url = `${api.admin.orderTypes.getByFilter(filter)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, count } = res.data;
        dispatch(getByFilterOrderTypesSuccess({ result: result, count: count }));
      })
      .catch((err) => {
        dispatch(getByFilterOrderTypesFailure(err.message));
      });
  };
};

const getOrderTypeRequest = () => ({
  type: types.GET_BY_ID_ORDER_TYPE_REQUEST,
});

const getOrderTypeSuccess = (value) => ({
  type: types.GET_BY_ID_ORDER_TYPE_SUCCESS,
  payload: value,
});

const getOrderTypeFailure = (error) => ({
  type: types.GET_BY_ID_ORDER_TYPE_ERROR,
  payload: {
    error,
  },
});

export const getOrderType = (id) => {
  return (dispatch) => {
    dispatch(getOrderTypeRequest());
    let url = `${api.admin.orderTypes.getById(id)}`;
    const headers = createHeaders();

    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getOrderTypeSuccess(result));
      })
      .catch((err) => {
        dispatch(getOrderTypeFailure(err.message));
      });
  };
};

export const setOrderTypeDetais = (value) => {
  return {
    type: types.SET_ORDER_TYPE,
    payload: value,
  };
};

export const createOrderType = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(createOrderTypeRequest());
    let url = `${api.admin.orderTypes.create}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createOrderTypeSuccess(ok));
        // dispatch(getOrderTypes(filterFactory));
        dispatch(getByFilterOrderTypes(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(createOrderTypeFailure(err.message));
      });
  };
};

const createOrderTypeRequest = () => ({
  type: types.ORDER_TYPE_CREATE_REQUEST,
});

const createOrderTypeSuccess = (isCreate) => ({
  type: types.ORDER_TYPE_CREATE_SUCCESS,
});

const createOrderTypeFailure = (error) => ({
  type: types.ORDER_TYPE_CREATE_ERROR,
  payload: {
    error,
  },
});

export const updateOrderType = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(updateOrderTypeRequest());
    let url = `${api.admin.orderTypes.update}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateOrderTypeSuccess(ok));
        dispatch(getByFilterOrderTypes(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(updateOrderTypeFailure(err.message));
      });
  };
};

const updateOrderTypeRequest = () => ({
  type: types.ORDER_TYPE_UPDATE_REQUEST,
});

const updateOrderTypeSuccess = (isUpdate) => ({
  type: types.ORDER_TYPE_UPDATE_SUCCESS,
});

const updateOrderTypeFailure = (error) => ({
  type: types.ORDER_TYPE_UPDATE_ERROR,
  payload: {
    error,
  },
});

const getOrderTypeByFactoryRequest = () => ({
  type: types.ORDER_TYPES_GET_BY_FACTORY_ID_REQUEST,
});

const getOrderTypeByFactorySuccess = (value) => ({
  type: types.ORDER_TYPES_GET_BY_FACTORY_ID_SUCCESS,
  payload: value,
});

const getOrderTypeByFactoryFailure = (error) => ({
  type: types.ORDER_TYPES_GET_BY_FACTORY_ID_ERROR,
  payload: {
    error,
  },
});

export const getOrderTypeByFactory = (factory_id) => {
  return (dispatch) => {
    dispatch(getOrderTypeByFactoryRequest());
    let url = `${api.admin.orderTypes.getByFactoryId(factory_id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getOrderTypeByFactorySuccess(result));
      })
      .catch((err) => {
        dispatch(getOrderTypeByFactoryFailure(err.message));
      });
  };
};

export const getOrderTypes = (idFactoryId = null) => {
  return (dispatch) => {
    if (idFactoryId) {
      dispatch(getOrderTypeByFactory(idFactoryId));
    } else {
      dispatch(getAllOrderType());
    }
  };
};
