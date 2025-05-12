import React, { useCallback, useState } from 'react';
import { TextField, Grid } from '@material-ui/core';
import { uploadFiles } from '../../../../../functions/api/order-process';
import { useStyles } from './styles';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';
import {
  UPLOAD_FILES_TITLE,
  CANCEL,
  SAVE,
} from '../../../../../constants/translations/review-popup';
import {
  CLOSE_BUTTON_BACKGROUND,
  BLUE_COLOR,
  WHITE_COLOR,
} from '../../../../../constants/review-popup';
import CustomizedButton from '../../reusableComponents/customizedButton';
import CustomizedAddButton from '../../reusableComponents/customizedAddIcon';
import Files from './files';
import { useSelector } from 'react-redux';
import { calculatePopupWidth } from '../../../utils';
import { useDispatch } from 'react-redux';
import { setCustomerData } from '../../../actions/customers_table_actions';

const UploadFilePopup = (props) => {
  const windowWidth = useSelector((state) => state.pageInfo.width);
  const { customerId, isOpen, handleClose } = props;

  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [files, setFiles] = useState([]);

  const addFileHandler = (element) => {
    const file = element.files[0];
    const newFiles = [...files, file];
    setFiles(newFiles);
  };

  const deleteFileHandler = useCallback(
    (idx) => {
      const filesCopy = [...files];
      filesCopy.splice(idx, 1);
      setFiles(filesCopy);
    },
    [files],
  );

  const closePopupHandler = () => {
    setFiles([]);
    handleClose();
  };

  const uploadFileHandler = async (customerId) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    setPending(true);
    const { ok, result } = await uploadFiles(formData, customerId);
    if (ok && result) {
      setPending(false);
      dispatch(setCustomerData(result));
      setFiles([]);
      handleClose();
    }
  };

  return (
    <DialogPopup
      handleClose={closePopupHandler}
      width={calculatePopupWidth(windowWidth)}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={closePopupHandler}
      title={UPLOAD_FILES_TITLE}
      actions={
        <UploadFileActions
          addFileHandler={addFileHandler}
          cancelHandler={closePopupHandler}
          saveHandler={() => uploadFileHandler(customerId)}
        />
      }
      content={
        <Files
          files={files}
          // setFiles = {updateCustomer}
          customerId={customerId}
          isSmall={true}
          deleteFileFromUploadPopupHandler={deleteFileHandler}
        />
      }
    />
  );
};

export default UploadFilePopup;

const UploadFileActions = (props) => {
  const classes = useStyles();
  const { addFileHandler, saveHandler, cancelHandler } = props;

  return (
    <Grid className={classes.buttonsWrapper}>
      <CustomizedButton
        backgroundColor={BLUE_COLOR}
        textColor={WHITE_COLOR}
        text={SAVE}
        clickHandler={saveHandler}
        width={'30%'}
      />
      <CustomizedButton
        backgroundColor={CLOSE_BUTTON_BACKGROUND}
        textColor={WHITE_COLOR}
        text={CANCEL}
        clickHandler={cancelHandler}
        width={'30%'}
      />
      <label className={classes.fileInputHolder}>
        <TextField
          style={{ display: 'none' }}
          type="file"
          onChange={(e) => addFileHandler(e.target)}
          multiple={true}
        />
        <CustomizedAddButton />
      </label>
    </Grid>
  );
};
