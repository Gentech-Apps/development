import React from 'react';
import Modal from '../modal';

export default function DialogWrapper(Component) {
  function DialogWrapper(props) {
    return (
      <>
        <Component {...props} />
        <Modal />
      </>
    );
  }
  return DialogWrapper;
}
