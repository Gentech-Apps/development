import * as types from './types';

export const setModalProps = (props) => ({
  type: types.SET_MODAL_PROPS,
  payload: { ...props, open: true },
});

export const closeModal = (props) => ({
  type: types.SET_MODAL_PROPS,
  payload: { open: false },
});
