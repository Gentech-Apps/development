import * as types from './types';
import axios from 'axios';
import { api, createHeaders } from '../constants/api-urls';

export const changeCurrentPage = (page) => ({
  type: types.ORDER_CATEGORIES_CHANGE_CURRENT_PAGE,
  payload: page,
});

export const changeRowsPerPage = (count) => ({
  type: types.ORDER_CATEGORIES_CHANGE_ROWS_PER_PAGE,
  payload: count,
});

const getAllOrderCategoriesRequest = () => ({
  type: types.GET_ALL_CATEGORIES_REQUEST,
});

const getAllOrderCategoriesSuccess = (value) => ({
  type: types.GET_ALL_CATEGORIES_SUCCESS,
  payload: value,
});

const getAllOrderCategoriesFailure = (error) => ({
  type: types.GET_ALL_CATEGORIES_ERROR,
  payload: {
    error,
  },
});

export const getAllOrderCategories = () => {
  return (dispatch) => {
    dispatch(getAllOrderCategoriesRequest());
    let url = `${api.admin.orderCategories.allOrderCategories}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getAllOrderCategoriesSuccess(result));
      })
      .catch((err) => {
        dispatch(getAllOrderCategoriesFailure(err.message));
      });
  };
};

const getByFilterCategoriesRequest = () => ({
  type: types.ADMIN_GET_FILTER_ORDER_CATEGORIES_REQUEST,
});

const getByFilterCategoriesSuccess = (value) => ({
  type: types.ADMIN_GET_FILTER_ORDER_CATEGORIES_SUCCESS,
  payload: value,
});

const getByFilterCategoriesFailure = (error) => ({
  type: types.ADMIN_GET_FILTER_ORDER_CATEGORIES_ERROR,
  payload: {
    error,
  },
});

export const getByFilterCategories = (limit = 20, page = 0, sort = -1, factory_id) => {
  return (dispatch) => {
    dispatch(getByFilterCategoriesRequest());
    let filter = `limit=${limit}&page=${page}&sort=${sort}${
      factory_id ? `&factory_id=${factory_id}` : ``
    }`;

    let url = `${api.admin.orderCategories.getByFilter(filter)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, count } = res.data;
        dispatch(getByFilterCategoriesSuccess({ result: result, count: count }));
      })
      .catch((err) => {
        dispatch(getByFilterCategoriesFailure(err.message));
      });
  };
};

const getOrderCategoryRequest = () => ({
  type: types.GET_BY_ID_CATEGORY_REQUEST,
});

const getOrderCategorySuccess = (value) => ({
  type: types.GET_BY_ID_CATEGORY_SUCCESS,
  payload: value,
});

const getOrderCategoryFailure = (error) => ({
  type: types.GET_BY_ID_CATEGORY_ERROR,
  payload: {
    error,
  },
});

export const getOrderCategory = (id) => {
  return (dispatch) => {
    dispatch(getOrderCategoryRequest());
    let url = `${api.admin.orderCategories.getById(id)}`;
    const headers = createHeaders();

    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getOrderCategorySuccess(result));
      })
      .catch((err) => {
        dispatch(getOrderCategoryFailure(err.message));
      });
  };
};

export const setOrderCategoryDetais = (value) => {
  return {
    type: types.SET_ORDER_CATEGORY,
    payload: value,
  };
};

export const createOrderCategory = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(createOrderCategoryRequest());
    let url = `${api.admin.orderCategories.create}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createOrderCategorySuccess(ok));
        // dispatch(getOrderCategories(filterFactory));
        dispatch(getByFilterCategories(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(createOrderCategoryFailure(err.message));
      });
  };
};

const createOrderCategoryRequest = () => ({
  type: types.ORDER_CATEGORY_CREATE_REQUEST,
});

const createOrderCategorySuccess = (isCreate) => ({
  type: types.ORDER_CATEGORY_CREATE_SUCCESS,
});

const createOrderCategoryFailure = (error) => ({
  type: types.ORDER_CATEGORY_CREATE_ERROR,
  payload: {
    error,
  },
});

export const updateOrderCategory = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(updateOrderCategoryRequest());
    let url = `${api.admin.orderCategories.update}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateOrderCategorySuccess(ok));
        dispatch(getByFilterCategories(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(updateOrderCategoryFailure(err.message));
      });
  };
};

const updateOrderCategoryRequest = () => ({
  type: types.ORDER_CATEGORY_UPDATE_REQUEST,
});

const updateOrderCategorySuccess = (isUpdate) => ({
  type: types.ORDER_CATEGORY_UPDATE_SUCCESS,
});

const updateOrderCategoryFailure = (error) => ({
  type: types.ORDER_CATEGORY_UPDATE_ERROR,
  payload: {
    error,
  },
});

const getOrderCategoryByFactoryRequest = () => ({
  type: types.ORDER_CATEGORIES_GET_BY_FACTORY_ID_REQUEST,
});

const getOrderCategoryByFactorySuccess = (value) => ({
  type: types.ORDER_CATEGORIES_GET_BY_FACTORY_ID_SUCCESS,
  payload: value,
});

const getOrderCategoryByFactoryFailure = (error) => ({
  type: types.ORDER_CATEGORIES_GET_BY_FACTORY_ID_ERROR,
  payload: {
    error,
  },
});

export const getOrderCategoryByFactory = (factory_id) => {
  return (dispatch) => {
    dispatch(getOrderCategoryByFactoryRequest());
    let url = `${api.admin.orderCategories.getByFactoryId(factory_id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getOrderCategoryByFactorySuccess(result));
      })
      .catch((err) => {
        dispatch(getOrderCategoryByFactoryFailure(err.message));
      });
  };
};

export const getOrderCategories = (idFactoryId = null) => {
  return (dispatch) => {
    if (idFactoryId) {
      dispatch(getOrderCategoryByFactory(idFactoryId));
    } else {
      dispatch(getAllOrderCategories());
    }
  };
};
