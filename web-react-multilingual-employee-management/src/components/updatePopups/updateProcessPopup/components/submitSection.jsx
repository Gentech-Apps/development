import React, { useState } from 'react';
import DeleteConfirmationPopUp from '../../../reused-components/DeleteConfirmationPopUp';
import { useOnline } from '../../../../hooks/useOnline';

const SubmitSection = (props) => {
  const { openPopup, closeMenu, submitForm, load_button, Loader, isOnline, orderNumber } = props;

  const onlineStatus = useOnline();

  const [confirmationPopUpOpen, setConfirmationPopUpOpen] = useState(false);
  return (
    <section
      className="custom__popup__update__submit-section"
      style={{ marginTop: '25px', justifyContent: 'space-between' }}
    >
      <div></div>
      <span className="link_button" onClick={openPopup}>
        {orderNumber}
      </span>
      <div>
        {load_button ? null : (
          <button onClick={() => (onlineStatus ? closeMenu() : setConfirmationPopUpOpen(true))}>
            ביטול
          </button>
        )}
        <button
          disabled={!isOnline}
          style={{ backgroundColor: isOnline ? '#0091ff' : '#ffb74d' }}
          onClick={() => {
            submitForm();
          }}
        >
          {load_button ? <Loader /> : 'שמור'}
        </button>
      </div>
      <DeleteConfirmationPopUp
        okCallback={() => closeMenu()}
        cancelCallback={() => setConfirmationPopUpOpen(false)}
        isOpen={confirmationPopUpOpen}
      />
    </section>
  );
};

export default SubmitSection;
