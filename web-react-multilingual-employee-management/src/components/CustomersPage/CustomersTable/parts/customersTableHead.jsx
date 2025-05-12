import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StyledTableCell } from '../../styles/CustomersTable.styles';
import { CUSTOMERS_TABLE_HEAD } from '../../../../constants/translations/customersPage';
const {
  CUSTOMER_NUMBER,
  CUSTOMER_NAME,
  CONTACT_NAME,
  CITY,
  ADDRESS,
  MOBILE_PHONE,
  EDIT,
  EMAIL,
} = CUSTOMERS_TABLE_HEAD;

const CustomersTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell>{CUSTOMER_NUMBER}</StyledTableCell>
        <StyledTableCell>{CUSTOMER_NAME}</StyledTableCell>
        <StyledTableCell>{CONTACT_NAME}</StyledTableCell>
        <StyledTableCell>{MOBILE_PHONE}</StyledTableCell>
        <StyledTableCell>{EMAIL}</StyledTableCell>
        <StyledTableCell>{CITY}</StyledTableCell>
        <StyledTableCell>{ADDRESS}</StyledTableCell>
        <StyledTableCell>{EDIT}</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

export default CustomersTableHead;
