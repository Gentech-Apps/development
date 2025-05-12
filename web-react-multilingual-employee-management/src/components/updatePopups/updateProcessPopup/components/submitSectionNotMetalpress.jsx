import React, { useEffect, useState } from 'react';
import DeleteConfirmationPopUp from '../../../reused-components/DeleteConfirmationPopUp';
import { EDIT_POP_UP } from '../../../../constants/translations/customersPage';
import { useOnline } from '../../../../hooks/useOnline';

const SubmitSectionNotMetalpress = (props) => {
  const onlineStatus = useOnline();

  const { CREATE_TASK } = EDIT_POP_UP;
  const { closeMenu, submitForm, load_button, Loader, isMobile, createTask } = props;

  const [confirmationPopUpOpen, setConfirmationPopUpOpen] = useState(false);
  return (
    <section
      className="custom__popup__update__submit-section"
      style={isMobile ? { justifyContent: 'flex-end' } : { justifyContent: 'space-between' }}
    >
      <div>
        {!isMobile ? (
          <h3 onClick={createTask} className="create_task_link">
            {CREATE_TASK}
          </h3>
        ) : null}
      </div>
      <div>
        {load_button ? null : (
          <button
            onClick={() => {
              onlineStatus ? closeMenu() : setConfirmationPopUpOpen(true);
            }}
          >
            ביטול
          </button>
        )}
        <button
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

export default SubmitSectionNotMetalpress;
