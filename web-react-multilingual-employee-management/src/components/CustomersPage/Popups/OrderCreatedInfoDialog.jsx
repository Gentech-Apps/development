import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Box, Typography } from '@material-ui/core';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';
import CustomizedButton from '../reused_components/customizedButton';
import { BLUE_COLOR, WHITE_COLOR } from '../../../constants/customers-page';

const OrderCreatedInfoDialog = ({ isOpen, closeHandler, message = '' }) => {
  return (
    <DialogPopup
      width={'auto'}
      height={'auto'}
      isOpen={isOpen}
      actions={
        <CustomizedButton
          clickHandler={closeHandler}
          backgroundColor={BLUE_COLOR}
          textColor={WHITE_COLOR}
          text={`אישור`}
          width={'auto'}
          height={'auto'}
        >
          אישור
        </CustomizedButton>
      }
      contentStyle={{ overflow: 'hidden', minHeight: '0px', paddingTop: '10px' }}
      content={
        <Box component="div" overflow="hidden" p={3}>
          <Typography variant="h6" align="center" gutterBottom>
            {message}
          </Typography>
        </Box>
      }
    />
  );
};

export default OrderCreatedInfoDialog;
