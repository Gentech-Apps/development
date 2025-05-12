import * as types from './types';
import axios from 'axios';

import { api, createHeaders } from '../constants/api-urls';

const getAllFactoryRequest = () => ({
  type: types.GET_ALL_FACTORY_REQUEST,
});

const getAllFactorySuccess = (factories) => ({
  type: types.GET_ALL_FACTORY_SUCCESS,
  payload: factories,
});

const getAllFactoryFailure = (error) => ({
  type: types.GET_ALL_FACTORY_ERROR,
  payload: {
    error,
  },
});

export const getAllFactory = () => {
  return (dispatch) => {
    dispatch(getAllFactoryRequest());
    let url = `${api.admin.factories.allFactories}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getAllFactorySuccess(result));
      })
      .catch((err) => {
        dispatch(getAllFactoryFailure(err.message));
      });
  };
};

const getFactoryRequest = () => ({
  type: types.GET_BY_ID_FACTORY_REQUEST,
});

const getFactorySuccess = (factories) => ({
  type: types.GET_BY_ID_FACTORY_SUCCESS,
  payload: factories,
});

const getFactoryListSuccess = (factories) => ({
  type: types.GET_ALL_FACTORY_SUCCESS,
  payload: [factories],
});

const getFactoryFailure = (error) => ({
  type: types.GET_BY_ID_FACTORY_ERROR,
  payload: {
    error,
  },
});

export const getFactory = (id, isList = false) => {
  return (dispatch) => {
    dispatch(getFactoryRequest());
    let url = `${api.admin.factories.getById(id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        if (isList) {
          dispatch(getFactoryListSuccess(result));
        } else {
          dispatch(getFactorySuccess(result));
        }
      })
      .catch((err) => {
        dispatch(getFactoryFailure(err.message));
      });
  };
};

export const setFactoryDetais = (factory) => {
  return {
    type: types.SET_FFACTORY,
    payload: factory,
  };
};

export const createFactory = (data) => {
  return (dispatch) => {
    dispatch(createFactoryRequest());
    let url = `${api.admin.factories.create}`;
    const headers = createHeaders();
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createFactorySuccess(ok));
        dispatch(getAllFactory());
      })
      .catch((err) => {
        dispatch(createFactoryFailure(err.message));
      });
  };
};

const createFactoryRequest = () => ({
  type: types.FACTORY_CREATE_REQUEST,
});

const createFactorySuccess = (isCreate) => ({
  type: types.FACTORY_CREATE_SUCCESS,
});

const createFactoryFailure = (error) => ({
  type: types.FACTORY_CREATE_ERROR,
  payload: {
    error,
  },
});

export const updateFactory = (data) => {
  return (dispatch) => {
    dispatch(updateFactoryRequest());
    let url = `${api.admin.factories.update}`;
    const headers = createHeaders();
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateFactorySuccess(ok));
        dispatch(getAllFactory());
      })
      .catch((err) => {
        dispatch(updateFactoryFailure(err.message));
      });
  };
};

export const setFactoryFilterValue = (value) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_FACTORY_FILTER_VALUE,
      payload: value,
    });
  };
};

const updateFactoryRequest = () => ({
  type: types.FACTORY_UPDATE_REQUEST,
});

const updateFactorySuccess = (isUpdate) => ({
  type: types.FACTORY_UPDATE_SUCCESS,
});

const updateFactoryFailure = (error) => ({
  type: types.FACTORY_UPDATE_ERROR,
  payload: {
    error,
  },
});

export const getFactories = (idFactoryId = null) => {
  return (dispatch) => {
    if (idFactoryId) {
      dispatch(getFactory(idFactoryId, true));
    } else {
      dispatch(getAllFactory());
    }
  };
};
