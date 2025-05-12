import React from 'react';
import { israelCities } from '../../../Header/Parts/ReservationPopup/parts/cities';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { CUSTOMERS_PAGE } from '../../../../constants/translations/customersPage';
import CustomizedTextField from '../../reused_components/inputs/CustomizedTextField';
import CustomizedSelect from '../../reused_components/inputs/CustomizedSelect';
import CustomizedDatePicker from '../../reused_components/inputs/CustomizedDatePicker';
import {
  CustomizedAutocompleteSelect,
  CustomizedAutocompleteSelectMultiple,
} from '../../reused_components/inputs/CustomizedAutocompleteSelect';
import CustomizedTextArea from '../../reused_components/inputs/CustomizedTextArea';
import SystemLevels from './SystemLevels';

const DialogContent = (props) => {
  const {
    TECHNICIANS,
    ADDRESS,
    CITY,
    ORDER_NUMBER,
    CUSTOMER_NAME,
    DUE_DATE,
    CONTACT_PERSON_NAME,
    CONTACT_PERSON_PHONE_NUMBER,
    SYSTEMS,
    REMARKS,
    SUBSYSTEM,
    SELECT_ORDER_TYPE,
    DESCRIPTION,
  } = CUSTOMERS_PAGE;
  const {
    orderNumber,
    setOrderNumber,
    technicians,
    setTechnicians,
    resources,
    customerName,
    dueDate,
    setDueDate,
    city,
    setCity,
    address,
    setAddress,
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    remarks,
    setRemarks,
    orderType,
    setOrderType,
    orderTypes,
    description,
    setDescription,
    // -------------------------------
    systems,
    orderSystems,
    setOrderSystems,
  } = props;
  return systems ? (
    <Box component="div" overflow="hidden" p={2}>
      <Grid container>
        <CustomizedAutocompleteSelect
          label={SELECT_ORDER_TYPE}
          value={orderType}
          changeHandler={setOrderType}
          options={orderTypes}
        />
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
        <SystemLevels
          systemLayers={systems}
          orderSystems={orderSystems}
          setOrderSystems={setOrderSystems}
        />
      </Grid>
      <Grid container spacing={2}>
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
      <Grid container spacing={2}>
        <CustomizedSelect
          label={CITY}
          value={city}
          changeHandler={setCity}
          options={israelCities}
          width={6}
        />
        <CustomizedTextField label={ADDRESS} value={address} changeHandler={setAddress} width={6} />
      </Grid>
      <Grid container spacing={2}>
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
      <Grid container spacing={2}>
        <CustomizedTextArea
          label={DESCRIPTION}
          value={description}
          changeHandler={setDescription}
          width={12}
        />
      </Grid>
      <Grid container spacing={2}>
        <CustomizedTextArea label={REMARKS} value={remarks} changeHandler={setRemarks} width={12} />
      </Grid>
    </Box>
  ) : null;
};

export default DialogContent;
