import * as React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useOngoingOrders } from '../../hooks/useOngoingOrders';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { SortOrder, useSorting } from '../../hooks/useSorting';
import { OrdersTableRow } from '../reused-components/OrdersTableRow';
import { useSortedOrders } from '../../hooks/useSortedOrders';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SideBar from '../SideBar/SideBar';
import { useDispatch } from 'react-redux';
import {
  setOrderDataForPopup,
  setOrderIdForPopup,
  showMainPopup,
} from '../../actions/mainPopup_actions';
import { StyledPaper, StyledTableCell } from './OngoingOrderReport.styles';
import { SmallLoader } from '../reused-components/SmallLoader';

export const OngoingOrdersReport = () => {
  const dispatch = useDispatch();
  let [orders, loading, ordersCount] = useOngoingOrders();

  const [currentOrder, currentSortBy, toggleSorting] = useSorting(SortOrder.Asc, 'due_date');
  const onSort = (columnName) => {
    toggleSorting(columnName, currentOrder);
  };

  const getSortDirection = (columnName, defaultOrder = SortOrder.Asc) => {
    return currentSortBy === columnName ? currentOrder : defaultOrder;
  };

  const isLabelActive = (columnName) => orders.length > 0 && currentSortBy === columnName;

  const filteredOrders = useSortedOrders(currentOrder, currentSortBy, orders);

  const selectOrder = (order) => {
    window.scrollTo(0, 0); //todo 1:  replace after rewrite ReservationPopup (should be sidebar instead of Header part
    dispatch(setOrderDataForPopup(order));
    dispatch(setOrderIdForPopup(order._id));
    dispatch(showMainPopup(true));
  };

  return (
    <div className="bids__page__container">
      <SideBar />
      <StyledPaper>
        <Box display="flex" justifyContent="space-between">
          <Box mr={2} mt={2}>
            <Typography variant="h4">הזמנות פתוחות</Typography>
          </Box>
          <Box ml={3} mt={4}>
            {filteredOrders.length > 0 && <Typography>סהכ הזמנות פתוחות: {ordersCount}</Typography>}
          </Box>
        </Box>
        <TableContainer style={{ maxHeight: 'calc(100vh - 173px)' }}>
          <Table stickyHeader aria-label="ongoing orders" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right" component="th" scope="row">
                  <TableSortLabel
                    active={isLabelActive('order_number')}
                    direction={getSortDirection('order_number')}
                    onClick={() => onSort('order_number')}
                    hideSortIcon={orders.length === 0}
                  >
                    מספר הזמנה / קריאה
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="right">שם לקוח</StyledTableCell>
                <StyledTableCell align="right">נייד</StyledTableCell>
                <StyledTableCell align="right">מייל</StyledTableCell>
                <StyledTableCell align="right">
                  <TableSortLabel
                    active={isLabelActive('value')}
                    direction={getSortDirection('value')}
                    onClick={() => onSort('value')}
                    hideSortIcon={orders.length === 0}
                  >
                    ערך עסקה
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TableSortLabel
                    active={isLabelActive('created_at')}
                    direction={getSortDirection('created_at')}
                    onClick={() => onSort('created_at')}
                    hideSortIcon={orders.length === 0}
                  >
                    תאריך פתיחת הצעה
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TableSortLabel
                    active={isLabelActive('due_date')}
                    direction={getSortDirection('due_date')}
                    onClick={() => onSort('due_date')}
                    hideSortIcon={orders.length === 0}
                  >
                    תאריך אספקה
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length
                ? filteredOrders.map((order) => (
                    <OrdersTableRow
                      onSetSelectedOrder={() => selectOrder(order)}
                      order={order}
                      key={order._id}
                    />
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center">
          {loading ? (
            <SmallLoader />
          ) : !filteredOrders.length ? (
            <Box mt={10}>
              <Typography variant="h4">אין הצעות מחיר</Typography>
            </Box>
          ) : null}
        </Box>
      </StyledPaper>
    </div>
  );
};
