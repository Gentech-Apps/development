import React, { useState } from 'react';
import { ADD_SYSTEM } from '../../../constants/translations/customersPage';
import CreateButton from '../reused_components/CreateButton';
import AddActualSystemsForm from '../Popups/AddActualSystemsForm';

const AddFilesButton = (props) => {
  const { customerId } = props;
  const [open, setOpen] = useState(false);

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      {open ? (
        <AddActualSystemsForm
          customerId={customerId}
          isOpen={open}
          closePopUpHandler={closeHandler}
        />
      ) : null}
      <CreateButton clickHandler={openHandler}>{ADD_SYSTEM}</CreateButton>
    </React.Fragment>
  );
};

export default AddFilesButton;
