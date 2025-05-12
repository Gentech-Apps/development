import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { StyledTableRow } from '../../styles/CustomersTable.styles';
import EditIcon from '@material-ui/icons/Edit';
import CreateCustomerPopUp from '../../Popups/createCustomerPopUp';
import { useDispatch } from 'react-redux';
import { resetCustomerData } from '../../../../actions/customers_table_actions';
import { useStyles } from '../../styles/CustomersTable.styles';
import { BLUE_COLOR } from '../../../../constants/customers-page';

const CustomersTableRow = ({ customer, factoryName, history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { _id, contact_name, name, phone, email, customer_number, city, address } = customer;
  const [isEditing, setIsEditing] = useState(false);

  const handleEditcustomer = () => {
    setIsEditing((i) => !i);
  };

  const handleCloseEditing = () => {
    setIsEditing(false);
  };

  const redirectHandler = () => {
    dispatch(resetCustomerData());
    history.push(`/${factoryName}/customers-page/${_id}`);
  };

  return (
    <StyledTableRow hover={true} onClick={redirectHandler}>
      <StyledTableCell value={customer_number} />
      <StyledTableCell value={name} />
      <StyledTableCell value={contact_name} />
      <StyledTableCell value={phone} />
      <StyledTableCell value={email} />
      <StyledTableCell value={city} />
      <StyledTableCell value={address} />
      <TableCell className={classes.customersTableCell} size={'medium'}>
        <EditIcon
          fontSize="large"
          style={{
            color: BLUE_COLOR,
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleEditcustomer();
          }}
        ></EditIcon>
      </TableCell>
      {isEditing && (
        <CreateCustomerPopUp
          customer={customer}
          isOpen={isEditing}
          handleClose={handleCloseEditing}
          // options = {options}
        />
      )}
    </StyledTableRow>
  );
};

const StyledTableCell = (props) => {
  const classes = useStyles();
  const { value } = props;
  return (
    <TableCell className={classes.customersTableCell} size={'medium'}>
      {value}
    </TableCell>
  );
};

export default CustomersTableRow;
