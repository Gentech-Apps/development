import * as types from '../actions/types';

const initialState = {
  title: 'Modal',
  open: false,
  component: null,
};

export default function modalReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_MODAL_PROPS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
