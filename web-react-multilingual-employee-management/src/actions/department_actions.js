import * as types from './types';
import axios from 'axios';
import { api, createHeaders } from '../constants/api-urls';

export const changeCurrentPage = (page) => ({
  type: types.DEPARTMENT_CHANGE_CURRENT_PAGE,
  payload: page,
});

export const changeRowsPerPage = (count) => ({
  type: types.DEPARTMENT_CHANGE_ROWS_PER_PAGE,
  payload: count,
});

const getByFilterDepartmentRequest = () => ({
  type: types.ADMIN_GET_FILTER_DEPARTMENT_REQUEST,
});

const getByFilterDepartmentSuccess = (value) => ({
  type: types.ADMIN_GET_FILTER_DEPARTMENT_SUCCESS,
  payload: value,
});

const getByFilterDepartmentFailure = (error) => ({
  type: types.ADMIN_GET_FILTER_DEPARTMENT_ERROR,
  payload: {
    error,
  },
});

export const getByFilterDepartments = (limit = 20, page = 0, sort = -1, factory_id) => {
  return (dispatch) => {
    dispatch(getByFilterDepartmentRequest());
    let filter = `limit=${limit}&page=${page}&sort=${sort}
    ${factory_id ? `&factory_id=${factory_id}` : ``}`;

    let url = `${api.admin.departments.getByFilter(filter)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, count } = res.data;
        dispatch(getByFilterDepartmentSuccess({ result: result, count: count }));
      })
      .catch((err) => {
        dispatch(getByFilterDepartmentFailure(err.message));
      });
  };
};

const getAllDepartmentRequest = () => ({
  type: types.GET_ALL_DEPARTMENT_REQUEST,
});

const getAllDepartmentSuccess = (factories) => ({
  type: types.GET_ALL_DEPARTMENT_SUCCESS,
  payload: factories,
});

const getAllDepartmentFailure = (error) => ({
  type: types.GET_ALL_DEPARTMENT_ERROR,
  payload: {
    error,
  },
});

export const getAllDepartment = () => {
  return (dispatch) => {
    dispatch(getAllDepartmentRequest());
    let url = `${api.admin.departments.allDepartments}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getAllDepartmentSuccess(result));
      })
      .catch((err) => {
        dispatch(getAllDepartmentFailure(err.message));
      });
  };
};

const getDepartmentRequest = () => ({
  type: types.GET_BY_ID_DEPARTMENT_REQUEST,
});

const getDepartmentSuccess = (department) => ({
  type: types.GET_BY_ID_DEPARTMENT_SUCCESS,
  payload: department,
});

const getDepartmentListSuccess = (department) => ({
  type: types.GET_ALL_DEPARTMENT_SUCCESS,
  payload: [department],
});

const getDepartmentFailure = (error) => ({
  type: types.GET_BY_ID_DEPARTMENT_ERROR,
  payload: {
    error,
  },
});

export const getDepartment = (id, isList = false) => {
  return (dispatch) => {
    dispatch(getDepartmentRequest());
    let url = `${api.admin.departments.getById(id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        if (isList) {
          dispatch(getDepartmentListSuccess(result));
        } else {
          dispatch(getDepartmentSuccess(result));
        }
      })
      .catch((err) => {
        dispatch(getDepartmentFailure(err.message));
      });
  };
};

export const setDepartmentDetais = (factory) => {
  return {
    type: types.SET_DEPARTMENT,
    payload: factory,
  };
};

export const setDepartmentFilterValue = (value) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_DEPARTMENT_FILTER_VALUE,
      payload: value,
    });
  };
};

export const createDepartment = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(createDepartmentRequest());
    let url = `${api.admin.departments.create}`;
    const headers = createHeaders();
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createDepartmentSuccess(ok));
        dispatch(getDepartments(filterFactory));
      })
      .catch((err) => {
        dispatch(createDepartmentFailure(err.message));
      });
  };
};

const createDepartmentRequest = () => ({
  type: types.DEPARTMENT_CREATE_REQUEST,
});

const createDepartmentSuccess = (isCreate) => ({
  type: types.DEPARTMENT_CREATE_SUCCESS,
});

const createDepartmentFailure = (error) => ({
  type: types.DEPARTMENT_CREATE_ERROR,
  payload: {
    error,
  },
});

export const updateDepartment = (data, filterFactory = null) => {
  return (dispatch) => {
    dispatch(updateDepartmentRequest());
    let url = `${api.admin.departments.update}`;
    const headers = createHeaders();
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateDepartmentSuccess(ok));
        dispatch(getDepartments(filterFactory));
      })
      .catch((err) => {
        dispatch(updateDepartmentFailure(err.message));
      });
  };
};

const updateDepartmentRequest = () => ({
  type: types.DEPARTMENT_UPDATE_REQUEST,
});

const updateDepartmentSuccess = (isUpdate) => ({
  type: types.DEPARTMENT_UPDATE_SUCCESS,
});

const updateDepartmentFailure = (error) => ({
  type: types.DEPARTMENT_UPDATE_ERROR,
  payload: {
    error,
  },
});

const getDeptByFactoryRequest = () => ({
  type: types.DEPARTMENT_GET_BY_FACTORY_ID_REQUEST,
});

const getDeptByFactorySuccess = (subDepartments) => ({
  type: types.DEPARTMENT_GET_BY_FACTORY_ID_SUCCESS,
  payload: subDepartments,
});

const getDeptByFactoryFailure = (error) => ({
  type: types.DEPARTMENT_GET_BY_FACTORY_ID_ERROR,
  payload: {
    error,
  },
});

export const getDeptByFactory = (factory_id) => {
  return (dispatch) => {
    dispatch(getDeptByFactoryRequest());
    let url = `${api.admin.departments.getByFactoryId(factory_id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getDeptByFactorySuccess(result));
      })
      .catch((err) => {
        dispatch(getDeptByFactoryFailure(err.message));
      });
  };
};

export const getDepartments = (idFactoryId = null, idDepartment = null) => {
  return (dispatch) => {
    if (idFactoryId) {
      dispatch(getDeptByFactory(idFactoryId));
    } else {
      dispatch(getAllDepartment());
    }
  };
};

export const dropDepartment = (id, selectedFactoryId) => {
  return (dispatch) => {
    let url = `${api.admin.departments.drop(id)}`;
    const headers = createHeaders();
    axios.get(url, { headers }).then((res) => {
      const { ok, result } = res.data;
      dispatch(getDepartments(selectedFactoryId));
    });
  };
};
