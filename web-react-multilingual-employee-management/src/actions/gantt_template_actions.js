import * as types from './types';
import axios from 'axios';
import { api, createHeaders } from '../constants/api-urls';

export const changeCurrentPage = (page) => ({
  type: types.GANTT_TEMPLATE_CHANGE_CURRENT_PAGE,
  payload: page,
});

export const changeRowsPerPage = (count) => ({
  type: types.GANTT_TEMPLATE_CHANGE_ROWS_PER_PAGE,
  payload: count,
});

const getAllProcessesRequest = () => ({
  type: types.GET_ALL_PROCESSES_REQUEST,
});

const getAllProcessesSuccess = (value) => ({
  type: types.GET_ALL_PROCESSES_SUCCESS,
  payload: value,
});

const getAllProcessesFailure = (error) => ({
  type: types.GET_ALL_PROCESSES_ERROR,
  payload: {
    error,
  },
});

export const getAllProcesses = () => {
  return (dispatch) => {
    dispatch(getAllProcessesRequest());
    let url = `${api.admin.processes.allProcesses}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getAllProcessesSuccess(result));
      })
      .catch((err) => {
        dispatch(getAllProcessesFailure(err.message));
      });
  };
};

const getByFilterProcessesRequest = () => ({
  type: types.ADMIN_GET_FILTER_PROCESSES_REQUEST,
});

const getByFilterProcessesSuccess = (value) => ({
  type: types.ADMIN_GET_FILTER_PROCESSES_SUCCESS,
  payload: value,
});

const getByFilterProcessesFailure = (error) => ({
  type: types.ADMIN_GET_FILTER_PROCESSES_ERROR,
  payload: {
    error,
  },
});

export const getByFilterProcesses = (
  limit = 20,
  page = 0,
  sort = -1,
  factory_id,
  is_delete,
  order_type,
  sub_department_id,
) => {
  return (dispatch) => {
    dispatch(getByFilterProcessesRequest());
    let filter = `limit=${limit}&page=${page}&sort=${sort}${
      factory_id ? `&factory_id=${factory_id}` : ``
    }${is_delete ? `&is_delete=${is_delete}` : ``}${order_type ? `&order_type=${order_type}` : ``}${
      sub_department_id ? `&sub_department_id=${sub_department_id}` : ``
    }`;

    let url = `${api.admin.processes.getByFilter(filter)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, count } = res.data;
        dispatch(getByFilterProcessesSuccess({ result: result, count: count }));
      })
      .catch((err) => {
        dispatch(getByFilterProcessesFailure(err.message));
      });
  };
};

const getProcessRequest = () => ({
  type: types.GET_BY_ID_PROCESS_REQUEST,
});

const getProcessSuccess = (value) => ({
  type: types.GET_BY_ID_PROCESS_SUCCESS,
  payload: value,
});

const getProcessFailure = (error) => ({
  type: types.GET_BY_ID_PROCESS_TYPE_ERROR,
  payload: {
    error,
  },
});

export const getProcess = (id) => {
  return (dispatch) => {
    dispatch(getProcessRequest());
    let url = `${api.admin.processes.getById(id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result, processesСonstrainedByCurrent } = res.data;
        let value = { ...result, processesСonstrainedByCurrent };
        dispatch(getProcessSuccess(value));
      })
      .catch((err) => {
        dispatch(getProcessFailure(err.message));
      });
  };
};

export const setProcessDetais = (value) => {
  return {
    type: types.SET_PROCESS,
    payload: value,
  };
};

export const createProcess = (data, filterFactory = null) => {
  return (dispatch) => {
    let url = `${api.admin.processes.create}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createProcessSuccess(ok));
        dispatch(getByFilterProcesses(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(createProcessFailure(err.message));
      });
  };
};

export const createProcessWithOrders = (data, filterFactory = null) => {
  return (dispatch) => {
    let url = `${api.admin.processes.createProcessWithOrders}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(createProcessSuccess(ok));
        dispatch(getByFilterProcesses(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(createProcessFailure(err.message));
      });
  };
};

const createProcessSuccess = (isCreate) => ({
  type: types.PROCESS_CREATE_SUCCESS,
});

const createProcessFailure = (error) => ({
  type: types.PROCESS_CREATE_ERROR,
  payload: {
    error,
  },
});

export const deleteProcess = (data, filterFactory = null) => {
  return (dispatch) => {
    let url = `${api.admin.processes.delete}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(deleteProcessSuccess(ok));
        //dispatch(getProcesses(filterFactory));
        dispatch(getByFilterProcesses(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(deleteProcessFailure(err.message));
      });
  };
};

export const deleteProcessWithOrders = (data, filterFactory = null) => {
  return (dispatch) => {
    let url = `${api.admin.processes.deleteProcessWithOrders}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(deleteProcessSuccess(ok));
        dispatch(getByFilterProcesses(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(deleteProcessFailure(err.message));
      });
  };
};

const deleteProcessSuccess = (isUpdate) => ({
  type: types.PROCESS_DELETE_SUCCESS,
});

const deleteProcessFailure = (error) => ({
  type: types.PROCESS_DELETE_ERROR,
  payload: {
    error,
  },
});

export const updateProcess = (data, filterFactory = null) => {
  return (dispatch) => {
    let url = `${api.admin.processes.update}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));
    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateProcessSuccess(ok));
        dispatch(getByFilterProcesses(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(updateProcessFailure(err.message));
      });
  };
};

export const updateProcessWithOrders = (data, filterFactory = null) => {
  return (dispatch) => {
    let url = `${api.admin.processes.updateProcessWithOrders}`;
    const headers = createHeaders();
    dispatch(changeCurrentPage(0));
    dispatch(changeRowsPerPage(10));

    axios
      .post(url, data, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(updateProcessSuccess(ok));
        dispatch(getByFilterProcesses(10, 0, -1, filterFactory));
      })
      .catch((err) => {
        dispatch(updateProcessFailure(err.message));
      });
  };
};

const updateProcessSuccess = (isUpdate) => ({
  type: types.PROCESS_UPDATE_SUCCESS,
});

const updateProcessFailure = (error) => ({
  type: types.PROCESS_UPDATE_ERROR,
  payload: {
    error,
  },
});

const getProcessBySubDeptRequest = () => ({
  type: types.PROCESSES_GET_BY_SUB_DEPARTMENT_ID_REQUEST,
});

const getProcessBySubDeptSuccess = (value) => ({
  type: types.PROCESSES_GET_BY_SUB_DEPARTMENT_ID_SUCCESS,
  payload: value,
});

const getProcessBySubDeptFailure = (error) => ({
  type: types.PROCESSES_GET_BY_SUB_DEPARTMENT_ID_ERROR,
  payload: {
    error,
  },
});

export const getProcessBySubDept = (sub_department_id) => {
  return (dispatch) => {
    dispatch(getProcessBySubDeptRequest());
    let url = `${api.admin.processes.getBySubDepartmentId(sub_department_id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getProcessBySubDeptSuccess(result));
      })
      .catch((err) => {
        dispatch(getProcessBySubDeptFailure(err.message));
      });
  };
};

const getProcessByFactoryRequest = () => ({
  type: types.PROCESS_GET_BY_FACTORY_ID_REQUEST,
});

const getProcessByFactorySuccess = (value) => ({
  type: types.PROCESS_GET_BY_FACTORY_ID_SUCCESS,
  payload: value,
});

const getProcessByFactoryFailure = (error) => ({
  type: types.PROCESS_GET_BY_FACTORY_ID_ERROR,
  payload: {
    error,
  },
});

export const getProcessByFactory = (factory_id) => {
  return (dispatch) => {
    dispatch(getProcessByFactoryRequest());
    let url = `${api.admin.processes.getByFactoryId(factory_id)}`;
    const headers = createHeaders();
    axios
      .get(url, { headers })
      .then((res) => {
        const { ok, result } = res.data;
        dispatch(getProcessByFactorySuccess(result));
      })
      .catch((err) => {
        dispatch(getProcessByFactoryFailure(err.message));
      });
  };
};

export const getProcesses = (idFactoryId = null, idSubDept = null) => {
  return (dispatch) => {
    if (idSubDept) {
      dispatch(getProcessBySubDept(idSubDept));
    } else if (idFactoryId) {
      dispatch(getProcessByFactory(idFactoryId));
    } else {
      dispatch(getAllProcesses());
    }
  };
};
