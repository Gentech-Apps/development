import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { useStyles } from '../styles/StylesForTables';
import CustomerOrdersTableHead from './components/CustomerOrdersTableHead';
import CustomerOrdersTableBody from './components/CustomerOrdersTableBody';
import ButtonsWrapper from '../reused_components/buttonsWrapper';
import CreatePlainOrderButton from '../Buttons/ServiceCreatePlainOrder';
import CreateSemiAnnualAuditButton from '../Buttons/ServiceCreateSemiAnnualAudit';
import CreateOrderWithSelectedSystemsButton from '../Buttons/ServiceCreateOrderWithSelectedSystems';
import { useSelector } from 'react-redux';
import { SERVICE } from '../../../constants';

const OrdersTable = (props) => {
  const { orders, customer, setOrders } = props;
  const classes = useStyles();
  const factoryType = useSelector((state) => state.login.user.type_of_factory);
  const isService = factoryType === SERVICE;
  return (
    <React.Fragment>
      <ButtonsWrapper>
        <CreatePlainOrderButton customer={customer} isService={isService} />
        {isService && <CreateSemiAnnualAuditButton customer={customer} />}
        {isService && <CreateOrderWithSelectedSystemsButton customer={customer} />}
      </ButtonsWrapper>
      {orders?.length ? (
        <TableContainer component={Paper} className={classes.container}>
          <Table size="small" stickyHeader>
            <CustomerOrdersTableHead />
            <CustomerOrdersTableBody data={orders} setOrders={setOrders} />
          </Table>
        </TableContainer>
      ) : null}
    </React.Fragment>
  );
};

export default OrdersTable;
