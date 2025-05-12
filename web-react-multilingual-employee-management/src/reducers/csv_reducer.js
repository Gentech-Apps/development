import {
  SET_CSV_WEEK_HEADERS,
  SET_CSV_WEEK_DATA,
  SET_CSV_MONTHLY,
  SET_CSV_CUSTOMER,
} from '../actions/types';

const initialState = {
  headers: [],
  data: [],
  filename: 'cochav.csv',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CSV_WEEK_HEADERS:
      return {
        ...state,
        headers: action.payload.headers,
        filename: 'cochav ' + action.payload.title + '.csv',
      };
    case SET_CSV_WEEK_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case SET_CSV_MONTHLY:
      return {
        ...state,
        headers: action.payload.headers,
        data: action.payload.data,
        filename: 'cochav ' + action.payload.title + '.csv',
      };
    case SET_CSV_CUSTOMER:
      return {
        ...state,
        headers: action.payload.headers,
        data: action.payload.data,
        filename: action.payload.title + '.csv',
      };
    default:
      return state;
  }
}
