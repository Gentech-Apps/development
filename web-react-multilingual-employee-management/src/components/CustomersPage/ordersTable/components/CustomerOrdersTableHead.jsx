import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { CUSTOMERS_PAGE } from '../../../../constants/translations/customersPage';
import { useSelector } from 'react-redux';
import { METALPRESS } from '../../../../constants/factories';
import { useStyles } from '../../styles/StylesForTables';

const CustomerOrdersTableHead = () => {
  const classes = useStyles();
  const currentFactory = useSelector((state) => state.login.user.factory_id);
  const {
    INTERNAL_REPORT,
    EXTERNAL_REPORT,
    ORDER_NUMBER,
    CUSTOMER_NAME,
    DUE_DATE,
    DELIVERY_DATE,
    CONTACT_PERSON_NAME,
    CONTACT_PERSON_PHONE_NUMBER,
    SIGNATURE,
    ACTIONS,
  } = CUSTOMERS_PAGE;

  const isMetalpress = currentFactory === METALPRESS;
  return (
    <TableHead>
      <TableRow>
        <TableCell size="medium" className={classes.tableHeaderCellStyle}>
          {ORDER_NUMBER}
        </TableCell>
        <TableCell size="medium" className={classes.tableHeaderCellStyle}>
          {CUSTOMER_NAME}
        </TableCell>
        <TableCell size="medium" className={classes.tableHeaderCellStyle}>
          {DELIVERY_DATE}
        </TableCell>
        <TableCell size="medium" className={classes.tableHeaderCellStyle}>
          {CONTACT_PERSON_NAME}
        </TableCell>
        <TableCell size="medium" className={classes.tableHeaderCellStyle}>
          {CONTACT_PERSON_PHONE_NUMBER}
        </TableCell>
        <TableCell size="medium" className={classes.tableHeaderCellStyle}>
          {ACTIONS}
        </TableCell>
        {/* <TableCell size = 'large'>{SIGNATURE}</TableCell>
        {isMetalpress ? <TableCell>{INTERNAL_REPORT}</TableCell> : null}
        {isMetalpress ? <TableCell>{EXTERNAL_REPORT}</TableCell> : null} */}
      </TableRow>
    </TableHead>
  );
};

export default CustomerOrdersTableHead;
