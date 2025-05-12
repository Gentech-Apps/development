import React, { useState } from 'react';
import CreateServiceCallWithSelectedSystemsPopUp from '../Popups/CreateServiceCallWithSelectedSystemsPopUp';
import OrderCreatedInfoDialog from '../Popups/OrderCreatedInfoDialog';
// import { useStyles } from './styles'
import { CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import CreateButton from '../reused_components/CreateButton';
import { ORDER_ADDED_SUCCESS } from '../../../constants/customers-page';
const { ORDER_WITH_SELECTED_SYSTEMS } = CUSTOMERS_PAGE;

const CreateOrderWithSelectedSystemsButton = (props) => {
  // const classes = useStyles()
  const { customer } = props;
  const [open, setOpen] = useState(false);
  const [orderCreatedPopup, openOrderCreatedPopup] = useState(false);
  const [defection_message, setDefectionMessage] = useState('');

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      {open ? (
        <CreateServiceCallWithSelectedSystemsPopUp
          isOpen={open}
          setIsOrderCreatedMessage={openOrderCreatedPopup}
          closeServiceCallPopUpHandler={closeHandler}
          customer={customer}
          isSpecialCall={true} /** points to a speciall systems, that marked from admin panel  */
          defectionMessage={setDefectionMessage}
        />
      ) : null}
      {orderCreatedPopup ? (
        <OrderCreatedInfoDialog
          isOpen={orderCreatedPopup}
          closeHandler={() => openOrderCreatedPopup(false)}
          message={defection_message ? defection_message : ORDER_ADDED_SUCCESS}
        />
      ) : null}
      <CreateButton clickHandler={openHandler}>{ORDER_WITH_SELECTED_SYSTEMS}</CreateButton>
    </React.Fragment>
  );
};

export default CreateOrderWithSelectedSystemsButton;
