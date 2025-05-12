//import { closeModal as close, setModalProps as setProps } from "components/modal/ModalActions"
import { useDispatch } from 'react-redux';
import { closeModal as close, setModalProps as setProps } from '../actions/actions';

export function useModal() {
  const dispatch = useDispatch();
  const closeModal = () => dispatch(close());
  const setModalProps = (modalProps) => dispatch(setProps(modalProps));
  return { closeModal, setModalProps };
}
