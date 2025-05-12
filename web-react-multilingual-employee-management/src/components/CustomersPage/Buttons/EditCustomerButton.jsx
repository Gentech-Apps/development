import React, { useState } from 'react';
import EditCustomerPopUp from '../Popups/createCustomerPopUp';
// import { useStyles } from './styles'
import editIcon from '../../../images/reviewPopup/edit.svg';
import { useStyles } from '../styles/CustomersTable.styles';
import { EDIT } from '../../../constants/translations/customersPage';
import { Grid, Typography } from '@material-ui/core';

const EditCustomerButton = (props) => {
  const classes = useStyles();
  const { customer } = props;
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
        <EditCustomerPopUp
          isOpen={open}
          handleClose={closeHandler}
          customer={customer}
          updateOpenCustomer={true}
        />
      ) : null}
      <Grid className={classes.alignItemsCenter}>
        <img src={editIcon} alt="edit" className={classes.editImage} onClick={openHandler} />
      </Grid>
    </React.Fragment>
  );
};

export default EditCustomerButton;
