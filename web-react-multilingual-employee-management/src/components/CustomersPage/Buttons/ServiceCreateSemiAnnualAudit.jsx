import React, { useState } from 'react';
import CreateServiceCallPopUp from '../Popups/CreateServiceCallPopUp';
import OrderCreatedInfoDialog from '../Popups/OrderCreatedInfoDialog';
// import { useStyles } from './styles'
import { CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import CreateButton from '../reused_components/CreateButton';
import { ORDER_ADDED_SUCCESS } from '../../../constants/customers-page';
const { SEMI_ANNUAL_AUDIT } = CUSTOMERS_PAGE;

const CreateSemiAnnualAudit = (props) => {
  // const classes = useStyles()
  const { customer } = props;
  const [open, setOpen] = useState(false);
  const [orderCreatedPopup, openOrderCreatedPopup] = useState(false);

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      {open ? (
        <CreateServiceCallPopUp
          isOpen={open}
          setIsOrderCreatedMessage={openOrderCreatedPopup}
          closeServiceCallPopUpHandler={closeHandler}
          customer={customer}
          isSpecialCall={true} /** points to a speciall systems, that marked from admin panel  */
        />
      ) : null}
      {orderCreatedPopup ? (
        <OrderCreatedInfoDialog
          isOpen={orderCreatedPopup}
          closeHandler={() => openOrderCreatedPopup(false)}
          message={ORDER_ADDED_SUCCESS}
        />
      ) : null}
      <CreateButton clickHandler={openHandler}>{SEMI_ANNUAL_AUDIT}</CreateButton>
    </React.Fragment>
  );
};

export default CreateSemiAnnualAudit;
