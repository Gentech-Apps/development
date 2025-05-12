import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { CUSTOMERS_PAGE } from '../../constants/translations/customersPage';
import PopUpButtons from '../CustomersPage/reused_components/PopUpButtons';
import DialogPopup from './DialogPopup/dialogPopup';
import { Typography } from '@material-ui/core';
const { CANCEL, OK } = CUSTOMERS_PAGE;

const DeleteConfirmationPopUp = (props) => {
  const { okCallback, cancelCallback, isOpen } = props;
  const okCallbackHandler = () => {
    okCallback();
    cancelCallback();
  };

  return (
    <DialogPopup
      width={'auto'}
      height={'auto'}
      isOpen={isOpen}
      actions={<PopUpButtons handleClose={cancelCallback} handleCloseAndSave={okCallbackHandler} />}
      contentStyle={{ overflow: 'hidden', minHeight: '0px', paddingTop: '10px' }}
      content={
        <Box component="div" overflow="hidden" p={3}>
          <Typography variant="h6" align="center" gutterBottom>
            האם לבטל?‎
          </Typography>
        </Box>
      }
    />
  );
};

export default DeleteConfirmationPopUp;
