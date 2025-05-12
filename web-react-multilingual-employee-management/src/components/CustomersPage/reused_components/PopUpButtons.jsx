import React from 'react';
import { Grid } from '@material-ui/core';
import { CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import { BLUE_COLOR, GREY_COLOR, WHITE_COLOR } from '../../../constants/customers-page';
import CustomizedButton from './customizedButton';
import { useStyles } from './style';
const { CANCEL, OK } = CUSTOMERS_PAGE;

const PopUpButtons = ({ handleClose, isLoading, loading = false, handleCloseAndSave }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.buttonsWrapper}>
      <CustomizedButton
        clickHandler={handleCloseAndSave}
        backgroundColor={BLUE_COLOR}
        textColor={WHITE_COLOR}
        text={OK}
        width={'42%'}
        loading={loading}
      />
      <CustomizedButton
        backgroundColor={GREY_COLOR}
        textColor={WHITE_COLOR}
        text={CANCEL}
        clickHandler={handleClose}
        width={'42%'}
        loading={false}
      />
    </Grid>
  );
};

export default PopUpButtons;
