import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { useStyles } from '../styles/StylesForTables';
import QuotationHistoryTableHead from './Components/QuotationHistoryTableHead';
import QuotationHistoryTableRow from './Components/QuotationHistoryTableRow';
import { stableSort, getComparator } from './tools';
import { useCreateUrlWithCustomerId } from '../../../hooks/useCreateUrlWithCustomerId';
import { useDataUpload } from '../../../hooks/useDataUpload';

const QuotationTable = (props) => {
  const GET_QUOTES_URL = `/system/customer-page/get-quotes`;
  const { customerId } = props;
  const url = useCreateUrlWithCustomerId(GET_QUOTES_URL, customerId);
  const [data] = useDataUpload(url);
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return data?.length ? (
    <div className={classes.root}>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} size={'small'} stickyHeader>
          <QuotationHistoryTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy)).map((row) => (
              <QuotationHistoryTableRow key={row._id} quote={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : null;
};

export default QuotationTable;
