import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useStyles } from '../../styles/StylesForTables';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuotationHistoryTableRow = ({ quote }) => {
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const history = useHistory();
  const { _id, order_number, value, status, date, customer_id } = quote;
  const classes = useStyles();
  const showQuoteHandler = () => {
    history.push(`/${factoryName}/customers-page/create-quote/${customer_id}/${_id}`);
  };
  return (
    <TableRow hover onClick={showQuoteHandler} className={classes.cursorPointer}>
      <TableCell size="medium" className={classes.tableBodyCellStyle}>
        {order_number}
      </TableCell>
      <TableCell size="medium" className={classes.tableBodyCellStyle}>
        {value}
      </TableCell>
      <TableCell size="medium" className={classes.tableBodyCellStyle}>
        {status}
      </TableCell>
      <TableCell size="medium" className={classes.tableBodyCellStyle}>
        {moment(date).format('DD/MM/YYYY')}
      </TableCell>
    </TableRow>
  );
};
export default QuotationHistoryTableRow;
