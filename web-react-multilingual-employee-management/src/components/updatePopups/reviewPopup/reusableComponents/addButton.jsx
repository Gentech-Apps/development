import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import CustomizedAddIcon from './customizedAddIcon';
import { ADD } from '../../../../constants/translations/review-popup';
// import addIcon from '../../../../../images/reviewPopup/add.svg'
import { useStyles } from './styles';
import UploadFilePopup from '../parts/files/uploadFilePopup';
import { SYSTEMS_TAB, TASKS_TAB, FILES_TAB } from '../../../../constants/review-popup';

const AddButton = (props) => {
  const classes = useStyles();
  const { activeTab, addSystemHandler, addTaskHandler, files, setFiles, customerId } = props;
  const [uploadFilePopupOpen, setUploadFilePopupOpen] = useState(false);

  const getHandler = () => {
    switch (activeTab) {
      case SYSTEMS_TAB: {
        return addSystemHandler();
      }
      case FILES_TAB: {
        setUploadFilePopupOpen(true);
        break;
      }
      case TASKS_TAB: {
        return addTaskHandler();
      }
    }
  };

  return (
    <div className={classes.container}>
      <CustomizedAddIcon clickHandler={getHandler} />
      <Typography variant="h6" classes={{ root: classes.dialogTitleText }}>
        {ADD}
      </Typography>
      {!!uploadFilePopupOpen && (
        <UploadFilePopup
          isOpen={uploadFilePopupOpen}
          handleClose={() => setUploadFilePopupOpen(false)}
          files={files}
          setFiles={setFiles}
          customerId={customerId}
        />
      )}
    </div>
  );
};

export default AddButton;
