import React from 'react';
import AddActualSystemsForm from './AddActualSystemsForm';
import OrderCreatedInfoDialog from './OrderCreatedInfoDialog';
import CreateServiceCallPopUp from './CreateServiceCallPopUp';
import CreateServiceCallWithSelectedSystemsPopUp from './CreateServiceCallWithSelectedSystemsPopUp';
import ReservationPopup from '../../Header/Parts/ReservationPopup/ReservationPopup';
import CustomerFilesPopUp from '../Files/CustomerFilesPopUp';
import { SYSTEM_LAYER_1, ORDER_ADDED_SUCCESS } from '../../../constants/customers-page';
import { updateCustomerFirstLevelSystems } from '../../../actions/customers_table_actions';
import { useDispatch } from 'react-redux';

const CustomerPagePopups = (props) => {
  const dispatch = useDispatch();
  const {
    customer,
    isAddActualSystemsFormOpen,
    addNewActualSystemHandler,
    isOrderCreatedMessage,
    closeOrderInfoDialog,
    isCreateServiceCallPopUpOpen,
    createServiceCallPopUpHandler,
    setIsOrderCreatedMessage,
    isSemiAnnualAudit,
    isCreateServiceCallWithSelectedSystemsPopUpOpen,
    createServiceCallWithSelectedSystemsPopUpHandler,
    setCreateOrderPopupOpen,
    updateOrdersList,
    isCreateOrderPopupOpen,
    orderType,
    isFilesPopUpOpen,
    uploadFileHandler,
    pendingFile,
    setFilesPopUpOpen,
  } = props;

  const updateFirstLayerSystemsHandler = (systems) =>
    dispatch(updateCustomerFirstLevelSystems(systems));

  return (
    <React.Fragment>
      {isAddActualSystemsFormOpen ? (
        <AddActualSystemsForm
          // closePopUpHandler = {}
          customer={customer}
          isOpen={isAddActualSystemsFormOpen}
          closePopUpHandler={addNewActualSystemHandler}
          systemLayer={SYSTEM_LAYER_1}
          updateSystemsHandler={updateFirstLayerSystemsHandler}
        />
      ) : null}
      <OrderCreatedInfoDialog
        isOpen={isOrderCreatedMessage}
        closeHandler={closeOrderInfoDialog}
        message={ORDER_ADDED_SUCCESS}
      />
      {isCreateServiceCallPopUpOpen ? (
        <CreateServiceCallPopUp
          isOpen={isCreateServiceCallPopUpOpen}
          closeHandler={createServiceCallPopUpHandler}
          setIsOrderCreatedMessage={setIsOrderCreatedMessage}
          closeServiceCallPopUpHandler={createServiceCallPopUpHandler}
          customer={customer}
          isSpecialCall={isSemiAnnualAudit}
        />
      ) : null}
      {isCreateServiceCallWithSelectedSystemsPopUpOpen ? (
        <CreateServiceCallWithSelectedSystemsPopUp
          isOpen={isCreateServiceCallWithSelectedSystemsPopUpOpen}
          closeHandler={createServiceCallWithSelectedSystemsPopUpHandler}
          setIsOrderCreatedMessage={setIsOrderCreatedMessage}
          closeServiceCallPopUpHandler={createServiceCallWithSelectedSystemsPopUpHandler}
          customer={customer}
        />
      ) : null}
      {isCreateOrderPopupOpen && (
        <ReservationPopup
          closePopup={() => setCreateOrderPopupOpen(false)}
          updateErrorPopup={updateOrdersList}
          customerPageOrderType={orderType}
          customerId={customer._id}
          contactName={customer.name}
          contactPhone={customer.phone}
          email={customer.email}
          city={{ name: customer.city }}
          address={customer.address}
        />
      )}
      <CustomerFilesPopUp
        customer={customer}
        isOpen={isFilesPopUpOpen}
        uploadFileHandler={uploadFileHandler}
        pendingFile={pendingFile}
        setFilesPopUpOpen={setFilesPopUpOpen}
      />
    </React.Fragment>
  );
};

export default CustomerPagePopups;
