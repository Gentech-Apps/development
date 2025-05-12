import React from 'react';
import editIcon from '../../../../images/reviewPopup/edit.svg';
import { Typography, Grid } from '@material-ui/core';
import { useStyles } from './styles';

const EditOrderButton = (props) => {
  const { clickHandler, orderNumber, customerName } = props;
  const classes = useStyles();
  return (
    <Grid className={classes.editOrderButtonWrapper}>
      <Typography variant="h6" classes={{ root: classes.customerNameRoot }}>
        {customerName}
      </Typography>
      <Typography variant="h6" classes={{ root: classes.textRoot }}>
        {orderNumber}
      </Typography>
      <img className={classes.icon} src={editIcon} alt="edit" onClick={clickHandler} />
    </Grid>
  );
};

export default EditOrderButton;
