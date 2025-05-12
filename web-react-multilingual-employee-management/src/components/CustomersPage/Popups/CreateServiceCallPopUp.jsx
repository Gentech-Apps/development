import React, { useState, useEffect } from 'react';
import { useStyles } from './styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch } from 'react-redux';
import { israelCities } from '../../Header/Parts/ReservationPopup/parts/cities';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import moment from 'moment';
import * as momentBusinessDays from 'moment-business-days';
import { createServiceCall } from '../../../functions/api/customer-page';
import { CUSTOM_FIELDS_CONTACT_NAME, CUSTOM_FIELDS_PHONE } from '../../../constants/custom-fields';
import { useResources } from '../../../hooks/useResources';
import { METALPRESS_TECHNICIANS } from '../../../constants/sub-departments';
import { createNewOrderFromCustomersPageSuccess } from '../../../actions/customers_table_actions';
import PopUpButtons from '../reused_components/PopUpButtons';
import CustomizedTextField from '../reused_components/inputs/CustomizedTextField';
import CustomizedSelect from '../reused_components/inputs/CustomizedSelect';
import CustomizedDatePicker from '../reused_components/inputs/CustomizedDatePicker';
import { CustomizedAutocompleteSelectMultiple } from '../reused_components/inputs/CustomizedAutocompleteSelect';
import {
  SERVICE_CALL_TYPE_ALL_SYSTEMS,
  SERVICE_CALL_TYPE_HALF_YEAR,
} from '../../../constants/customers-page';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';

momentBusinessDays.updateLocale('us', {
  workingWeekdays: [0, 1, 2, 3, 4],
});

const CreateServiceCallPopUp = ({
  isOpen,
  customer,
  setIsOrderCreatedMessage,
  closeServiceCallPopUpHandler,
  isSpecialCall,
}) => {
  const {
    REVIEW,
    TECHNICIANS,
    ADDRESS,
    CITY,
    ORDER_NUMBER,
    CUSTOMER_NAME,
    DUE_DATE,
    CONTACT_PERSON_NAME,
    CONTACT_PERSON_PHONE_NUMBER,
    SEMI_ANNUAL_AUDIT,
  } = CUSTOMERS_PAGE;
  const {
    address: customerAddress,
    city: customerCity,
    contact_name,
    email,
    name,
    phone,
    _id,
    systems,
    terms_of_engagement,
  } = customer;
  const classes = useStyles();
  const resources = useResources(METALPRESS_TECHNICIANS);
  const dueDateDefault = moment(momentBusinessDays(new Date()).businessAdd(1)._d).format(
    'YYYY-MM-DD',
  );
  const dispatch = useDispatch();

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

  useEffect(() => {
    setTechnicians([]);
    setOrderNumber('');
    setDueDate(dueDateDefault);
    setCustomerName(name);
    setCity(customerCity);
    setAddress(customerAddress);
    setContactPhone(phone);
    setContactName(contact_name);
  }, [customer]);

  const cleanInputs = () => {
    setTechnicians([]);
    setOrderNumber('');
    setDueDate(dueDateDefault);
    setCity(customerCity);
    setAddress(customerAddress);
    setContactPhone(phone);
    setContactName(contact_name);
  };

  const body = {
    type: isSpecialCall ? SERVICE_CALL_TYPE_HALF_YEAR : SERVICE_CALL_TYPE_ALL_SYSTEMS,
    [CUSTOM_FIELDS_CONTACT_NAME]: contactName,
    [CUSTOM_FIELDS_PHONE]: contactPhone,
    address,
    city,
    client_name: customerName,
    customer_id: _id,
    due_date: dueDate,
    employees: [],
    order_number: orderNumber,
    // systems: isSpecialCall ? []: systems,
    technician_resource: technicians,
    agreement_terms: terms_of_engagement,
  };

  const handleCloseAndSave = async () => {
    setLoading((prev) => !prev);
    set_Loading((prev) => !prev);
    let { ok, result } = await createServiceCall(body);
    setLoading((prev) => !prev);
    set_Loading((prev) => !prev);
    if (result && ok) {
      cleanInputs();
      dispatch(createNewOrderFromCustomersPageSuccess(result));
      setIsOrderCreatedMessage(true);
      closeServiceCallPopUpHandler();
    }
  };

  const handleClose = () => {
    cleanInputs();
    closeServiceCallPopUpHandler();
  };

  return (
    <DialogPopup
      handleClose={handleClose}
      width={'40%'}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={handleClose}
      title={isSpecialCall ? SEMI_ANNUAL_AUDIT : REVIEW}
      actions={
        <PopUpButtons
          handleClose={handleClose}
          isLoading={isLoading}
          loading={loading}
          handleCloseAndSave={handleCloseAndSave}
        />
      }
      content={
        <Box component="div" overflow="hidden" p={2}>
          <Grid container className={classes.root}>
            <CustomizedTextField
              label={ORDER_NUMBER}
              value={orderNumber}
              changeHandler={setOrderNumber}
              width={12}
            />
            <CustomizedAutocompleteSelectMultiple
              label={TECHNICIANS}
              value={technicians}
              changeHandler={setTechnicians}
              options={resources}
            />
          </Grid>
          <Grid container className={classes.root} spacing={2}>
            <CustomizedTextField
              label={CUSTOMER_NAME}
              value={customerName}
              changeHandler={null}
              width={6}
            />
            <CustomizedDatePicker
              label={DUE_DATE}
              value={dueDate}
              changeHandler={setDueDate}
              width={6}
            />
          </Grid>
          <Grid container className={classes.root} spacing={2}>
            <CustomizedSelect
              label={CITY}
              value={city}
              changeHandler={setCity}
              options={israelCities}
              width={6}
            />
            <CustomizedTextField
              label={ADDRESS}
              value={address}
              changeHandler={setAddress}
              width={6}
            />
          </Grid>
          <Grid container className={classes.root} spacing={2}>
            <CustomizedTextField
              label={CONTACT_PERSON_NAME}
              value={contactName}
              changeHandler={setContactName}
              width={6}
            />
            <CustomizedTextField
              label={CONTACT_PERSON_PHONE_NUMBER}
              value={contactPhone}
              changeHandler={setContactPhone}
              width={6}
            />
          </Grid>
        </Box>
      }
    />
  );
};

export default CreateServiceCallPopUp;
