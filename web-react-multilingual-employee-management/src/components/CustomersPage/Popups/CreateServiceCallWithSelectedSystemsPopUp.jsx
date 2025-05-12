import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import moment from 'moment';
import * as momentBusinessDays from 'moment-business-days';
import {
  createServiceCall,
  getOrderTypesForActionOrder,
} from '../../../functions/api/customer-page';
import {
  CUSTOM_FIELDS_CONTACT_NAME,
  CUSTOM_FIELDS_PHONE,
  CUSTOM_FIELDS_REMARKS,
} from '../../../constants/custom-fields';
import { useResources } from '../../../hooks/useResources';
import { METALPRESS_TECHNICIANS } from '../../../constants/sub-departments';
import { createNewOrderFromCustomersPageSuccess } from '../../../actions/customers_table_actions';
import PopUpButtons from '../reused_components/PopUpButtons';
import { CUSTOM_FIELDS_DESCRIPTION } from '../../../constants/custom-fields';
import DialogContent from './CreateServiceCallWithSelectedSystemsParts/DialogContent';
import { useCustomerSystems } from '../../../hooks/useCustomerSystems';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';
import Loader from '../../LoaderNew/Loader';

momentBusinessDays.updateLocale('us', {
  workingWeekdays: [0, 1, 2, 3, 4],
});

const CreateServiceCallWithSelectedSystemsPopUp = ({
  isOpen,
  customer,
  setIsOrderCreatedMessage,
  closeServiceCallPopUpHandler,
  defectionMessage,
}) => {
  const { CREATE_SERVICE_CALL, ORDER_WITH_SELECTED_SYSTEMS } = CUSTOMERS_PAGE;
  const {
    address: customerAddress,
    city: customerCity,
    contact_name,
    name,
    phone,
    _id,
    terms_of_engagement,
  } = customer;
  const resources = useResources(METALPRESS_TECHNICIANS);
  const dueDateDefault = moment(momentBusinessDays(new Date()).businessAdd(1)._d).format(
    'YYYY-MM-DD',
  );
  const dispatch = useDispatch();
  const [orderSystems, setOrderSystems] = useState([]);
  const systems = useCustomerSystems(_id, orderSystems);
  const [orderType, setOrderType] = useState('');
  const [orderTypes, setOrderTypes] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');
  const [dueDate, setDueDate] = useState(dueDateDefault);
  const [customerName, setCustomerName] = useState(name);
  const [city, setCity] = useState(customerCity);
  const [address, setAddress] = useState(customerAddress);
  const [contactPhone, setContactPhone] = useState(phone);
  const [contactName, setContactName] = useState(contact_name);
  const [isLoading, setLoading] = useState(false);
  const [loading, set_Loading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [description, setDescription] = useState('');
  const orders_id = useSelector((state) => state.customersPage.setCustomerOrders)[0]?._id;

  useEffect(() => {
    cleanInputs();
  }, [customer]);

  useEffect(() => {
    cleanInputs();
    (async () => {
      const result = await getOrderTypesForActionOrder();
      if (result?.result) setOrderTypes(result.result);
    })();
  }, []);

  const cleanInputs = () => {
    setTechnicians([]);
    setOrderNumber('');
    setDueDate(dueDateDefault);
    setCity(customerCity);
    setAddress(customerAddress);
    setContactPhone(phone);
    setContactName(contact_name);
    setOrderSystems([]);
    setRemarks('');
    setOrderType('');
    setDescription('');
  };

  const body = {
    type: orderType?.type,
    [CUSTOM_FIELDS_CONTACT_NAME]: contactName,
    [CUSTOM_FIELDS_PHONE]: contactPhone,
    address,
    city,
    client_name: customerName,
    customer_id: _id,
    due_date: dueDate,
    employees: [],
    order_number: orderNumber,
    systems: orderSystems,
    technician_resource: technicians,
    [CUSTOM_FIELDS_REMARKS]: remarks,
    agreement_terms: terms_of_engagement,
    [CUSTOM_FIELDS_DESCRIPTION]: description,
    recent_updated_order_id: orders_id,
  };

  const handleCloseAndSave = async () => {
    if (body.systems.length === 0) {
      body.systems = defaultSystem();
    } // if not any system selected return default system
    setLoading(true);
    set_Loading(true);
    let { ok, result } = await createServiceCall(body);
    setLoading(false);
    set_Loading(false);
    if (result && ok) {
      cleanInputs();
      dispatch(createNewOrderFromCustomersPageSuccess(result));
      setIsOrderCreatedMessage(true);
      closeServiceCallPopUpHandler();
      defectionMessage('');
    }
    if (!ok && typeof result === 'string') {
      defectionMessage(result);
      setIsOrderCreatedMessage(true);
      closeServiceCallPopUpHandler();
    }
  };

  const defaultSystem = () => {
    return [
      {
        layer: 1,
        systems: [
          { parent_system_id: null, systems: systems[0]?.systems?.map((inItem) => inItem._id) },
        ],
      },
    ];
  };

  const handleClose = () => {
    closeServiceCallPopUpHandler();
    cleanInputs();
  };
  return systems ? (
    orderTypes ? (
      <DialogPopup
        handleClose={handleClose}
        width={'40%'}
        height={'fit-content'}
        isOpen={isOpen}
        handleCancel={handleClose}
        title={ORDER_WITH_SELECTED_SYSTEMS}
        actions={
          <PopUpButtons
            handleClose={handleClose}
            isLoading={!orderNumber || isLoading || !orderType}
            handleCloseAndSave={handleCloseAndSave}
            loading={loading}
          />
        }
        content={
          <DialogContent
            orderNumber={orderNumber}
            setOrderNumber={setOrderNumber}
            technicians={technicians}
            setTechnicians={setTechnicians}
            resources={resources}
            setOrderSystems={setOrderSystems}
            customerName={customerName}
            dueDate={dueDate}
            setDueDate={setDueDate}
            city={city}
            setCity={setCity}
            address={address}
            setAddress={setAddress}
            contactName={contactName}
            setContactName={setContactName}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            remarks={remarks}
            setRemarks={setRemarks}
            orderType={orderType}
            setOrderType={setOrderType}
            orderTypes={orderTypes}
            description={description}
            setDescription={setDescription}
            // -----------------------------
            systems={systems}
            orderSystems={orderSystems}
            setOrderSystems={setOrderSystems}
          />
        }
      />
    ) : (
      <Loader />
    )
  ) : (
    <Loader />
  );
};

export default CreateServiceCallWithSelectedSystemsPopUp;
