import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useStyles } from '../styles/CustomersTable.styles';
import EditCustomerButton from '../Buttons/EditCustomerButton';
import { API } from '../../../tools/keys/keys';
import Avatar from '@material-ui/core/Avatar';
import { setCustomerData } from '../../../actions/customers_table_actions';
import { useDispatch } from 'react-redux';
import { TextField } from '@material-ui/core';
import { uploadAvatar } from '../../../functions/api/customer-page';

const EditCustomerSection = (props) => {
  const classes = useStyles();
  const customer = useSelector((state) => state.customersPage.customerData);
  const customerName = customer?.name;
  const customerId = customer._id;
  const avatar = customer?.avatar;
  const dispatch = useDispatch();

  const addAvatarHandler = async (element) => {
    const formData = new FormData();
    formData.append('avatar', element.files[0]);
    const avatar = await uploadAvatar(formData, customerId);
    const newCustomerData = { ...customer, avatar };
    dispatch(setCustomerData(newCustomerData));
  };

  return (
    <Grid className={classes.editCustomerSectionWrapper}>
      <Grid className={classes.alignItemsCenter}>
        <label>
          <TextField
            style={{ display: 'none' }}
            type="file"
            onChange={(e) => addAvatarHandler(e.target)}
          />

          <Avatar src={API + avatar} alt="Avatar" className={classes.avatar} />
        </label>
        <Typography variant="h3" className={classes.editCustomerTypography}>
          {customerName}
        </Typography>
      </Grid>
      <EditCustomerButton customer={customer} />
    </Grid>
  );
};

export default EditCustomerSection;
