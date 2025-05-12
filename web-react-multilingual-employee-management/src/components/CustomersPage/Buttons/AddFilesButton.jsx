import React, { useState } from 'react';
import { ADD_FILES } from '../../../constants/translations/customersPage';
import CreateButton from '../reused_components/CreateButton';
import UploadFilePopup from '../Popups/UploadFilePopup';

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
        <UploadFilePopup customerId={customerId} isOpen={open} handleClose={closeHandler} />
      ) : null}
      <CreateButton clickHandler={openHandler}>{ADD_FILES}</CreateButton>
    </React.Fragment>
  );
};

export default AddFilesButton;
