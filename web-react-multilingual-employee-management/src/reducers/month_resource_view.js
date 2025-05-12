import * as types from '../actions/types';

const initialState = {
  loading: false,
  simpleDateArray: [],
  calenderFlag: false,
  stateChanged: false,
  orderNumber: '',
  check_list: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_DATES_ARRAY_MONTH_RESOURCE:
      state.datesArray = action.payload;
      return state;
    case types.UPDATE_MONTH_RESOURCE_LOADER:
      state.loading = action.payload;
      return state;
    case types.UPDATE_MONTH_RESOURCE_SIMPLE_DATE:
      state.simpleDateArray = action.payload;
      return state;
    case types.MONTH_RESOURCE_CALENDER_UPDATE:
      state.calenderFlag = action.payload;
      return state;
    case types.MONTH_GLOBAL_STATE_MANAGER:
      state.stateChanged = action.payload;
      return state;
    case types.MONTH_UPDATE_API:
      state.orderNumber = action.payload.orderNumber;
      return state;
    case types.CUSTOMER_CHECK_LIST:
      state.check_list = action.payload;
      return state;
    default:
      return state;
  }
}
