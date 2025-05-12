import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { Time, TimeFormat } from './Time';
import Typography from '@material-ui/core/Typography';
import { StyledButton } from './OrderTableRow.styles';
import { StyledTableRow } from '../OngoingOrdersReport/OngoingOrderReport.styles';

export const OrdersTableRow = ({ order, onSetSelectedOrder }) => {
  return (
    <StyledTableRow hover={true}>
      <TableCell align="right">{order.order_number}</TableCell>
      <TableCell align="right">{order.client_name}</TableCell>
      <TableCell align="right">{order.client_phone}</TableCell>
      <TableCell align="right">{order.client_email}</TableCell>
      <TableCell align="right">{order.value}</TableCell>
      <TableCell align="right">
        <Typography variant="overline">
          <Time timestamp={order.created_at} format={TimeFormat.date} />
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="overline">
          <Time timestamp={order.due_date} format={TimeFormat.date} />
        </Typography>
      </TableCell>
      <TableCell align="right">
        <StyledButton size="small" variant="contained" onClick={onSetSelectedOrder}>
          הצג
        </StyledButton>
      </TableCell>
    </StyledTableRow>
  );
};
