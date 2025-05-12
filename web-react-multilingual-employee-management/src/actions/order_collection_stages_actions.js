import * as types from './types';
import axios from 'axios';
import { api, createHeaders } from '../constants/api-urls';

export const changeCurrentPage = (page) => ({
  type: types.ORDER_COLLECTION_STAGES_CHANGE_CURRENT_PAGE,
  payload: page,
});

export const changeRowsPerPage = (count) => ({
  type: types.ORDER_COLLECTION_STAGES_CHANGE_ROWS_PER_PAGE,
  payload: count,
});

const getByFilterOrderCollectionStagesRequest = () => ({
  type: types.ADMIN_GET_FILTER_ORDER_COLLECTION_STAGES_REQUEST,
});

const getByFilterOrderCollectionStagesSuccess = (value) => ({
  type: types.ADMIN_GET_FILTER_ORDER_COLLECTION_STAGES_SUCCESS,
  payload: value,
});

const getByFilterOrderCollectionStagesFailure = (error) => ({
  type: types.ADMIN_GET_FILTER_ORDER_COLLECTION_STAGES_ERROR,
  payload: {
    error,
  },
});

export const getByFilterOrderCollectionStages = (limit = 20, page = 0, sort = -1, factory_id) => {
  return (dispatch) => {
    dispatch(getByFilterOrderCollectionStagesRequest());
    let filter = `limit=${limit}&page=${page}&sort=${sort}${
      factory_id ? `&factory_id=${factory_id}` : ``
    }`;
    let url = `${api.admin.orderCollectionStages.getByFilter(filter)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, count } = res.data;
        dispatch(getByFilterOrderCollectionStagesSuccess({ result: result, count: count }));
      })
      .catch((err) => {
        dispatch(getByFilterOrderCollectionStagesFailure(err.message));
      });
  };
};

const getOrderCollectionStageRequest = () => ({
  type: types.GET_BY_ID_ORDER_COLLECTION_STAGE_REQUEST,
});

const getOrderCollectionStageSuccess = (value) => ({
  type: types.GET_BY_ID_ORDER_COLLECTION_STAGE_SUCCESS,
  payload: value,
});

const getOrderCollectionStageFailure = (error) => ({
  type: types.GET_BY_ID_ORDER_COLLECTION_STAGE_ERROR,
  payload: {
    error,
  },
});

export const getOrderCollectionStage = (id) => {
  return (dispatch) => {
    dispatch(getOrderCollectionStageRequest());
    let url = `${api.admin.orderCollectionStages.getById(id)}`;
    const headers = createHeaders();

    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getOrderCollectionStageSuccess(result));
      })
      .catch((err) => {
        dispatch(getOrderCollectionStageFailure(err.message));
      });
  };
};

export const setOrderCollectionStage = (value) => {
  return {
    type: types.SET_ORDER_COLLECTION_STAGES,
    payload: value,
  };
};

export const createOrderCollectionStage = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(createOrderCollectionStageRequest());
    let url = `${api.admin.orderCollectionStages.create}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createOrderCollectionStageSuccess(ok));
        dispatch(getByFilterOrderCollectionStages(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(createOrderCollectionStageFailure(err.message));
      });
  };
};

const createOrderCollectionStageRequest = () => ({
  type: types.ORDER_COLLECTION_STAGE_CREATE_REQUEST,
});

const createOrderCollectionStageSuccess = (isCreate) => ({
  type: types.ORDER_COLLECTION_STAGE_CREATE_SUCCESS,
});

const createOrderCollectionStageFailure = (error) => ({
  type: types.ORDER_COLLECTION_STAGE_CREATE_ERROR,
  payload: {
    error,
  },
});

export const updateOrderCollectionStage = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(updateOrderCollectionStageRequest());
    let url = `${api.admin.orderCollectionStages.update}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateOrderCollectionStageSuccess(ok));
        dispatch(getByFilterOrderCollectionStages(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(updateOrderCollectionStageFailure(err.message));
      });
  };
};

const updateOrderCollectionStageRequest = () => ({
  type: types.ORDER_COLLECTION_STAGE_UPDATE_REQUEST,
});

const updateOrderCollectionStageSuccess = (isUpdate) => ({
  type: types.ORDER_COLLECTION_STAGE_UPDATE_SUCCESS,
});

const updateOrderCollectionStageFailure = (error) => ({
  type: types.ORDER_COLLECTION_STAGE_UPDATE_ERROR,
  payload: {
    error,
  },
});
