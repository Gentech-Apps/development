import React, { useEffect, useState } from 'react';
import { useStyles } from '../styles/CustomersTable.styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { createOrEditCustomer } from '../../../actions/customers_table_actions';
import { useDispatch } from 'react-redux';
import { israelCities } from '../../Header/Parts/ReservationPopup/parts/cities';
import Box from '@material-ui/core/Box';
import PopUpButtons from '../reused_components/PopUpButtons';
import { CREATE_CUSTOMER_POPUP } from '../../../constants/translations/customersPage';
import CustomizedSelect from '../reused_components/inputs/CustomizedSelect';
import CustomizedDatePicker from '../reused_components/inputs/CustomizedDatePicker';
import { useSelector } from 'react-redux';
import { METALPRESS } from '../../../constants/factories';
import { useCheckIsNameFree } from '../../../hooks/useCheckIsNameFree';
import { useCustomerInputs } from '../../../hooks/useCustomerInputs';
import { getCustomerInfoSuccess } from '../../../actions/customers_table_actions';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';

const CreateCustomerPopUp = ({ isOpen, handleClose, customer, updateOpenCustomer }) => {
  const {
    BUILDING_MODEL,
    TERMS_OF_ENGAGEMENT,
    PROJECT_DESCRIPTION,
    CITY,
    FLOORS_QUANTITY,
    PARKING_LEVELS_QUANTITY,
    IS_THE_PARKING_LOT_SHARED,
    SHARED_PARKINGS_FOR_A_NUMBER_OF_BUILDINGS,
    YEAR_OF_OCCUPANCY,
    NAME_ALREADY_EXIST_WARNING,
    NAME,
    CUSTOMER_NUMBER,
    CREATE_CUSTOMER,
    CONTACT_NAME,
    PHONE,
    EMAIL,
    ADDRESS,
  } = CREATE_CUSTOMER_POPUP;

  const options = useCustomerInputs();
  const classes = useStyles();

  const dispatch = useDispatch();
  const currentFactory = useSelector((state) => state.login.user.factory_id);

  const isCurrentFactoryMetalpress = () => {
    return currentFactory === METALPRESS;
  };

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  // -------------------
  const [description, setDescription] = useState('');
  const [buildingModel, setBuildingModel] = useState('');
  const [termsOfEngagement, setTermsOfEngagement] = useState('');
  const [floorsQuantity, setFloorsQuantity] = useState('');
  const [parkingLevelsQuantity, setParkingLevelsQuantity] = useState('');
  const [parkingLotShared, setParkingLotShared] = useState('');
  const [sharedParkings, setSharedParkings] = useState('');
  const [yearOfOccupancy, setYearOfOccupancy] = useState(new Date());
  const isNameFree = useCheckIsNameFree(name, customer?.name);

  useEffect(() => {
    setId(customer?._id || '');
    setName(customer?.name || '');
    setContactName(customer?.contact_name || '');
    setPhone(customer?.phone || '');
    setEmail(customer?.email || '');
    setCustomerNumber(customer?.customer_number || '');
    setCity(customer?.city || '');
    setAddress(customer?.address || '');
    setDescription(customer?.description || '');
    setBuildingModel(customer?.building_model || '');
    setTermsOfEngagement(customer?.terms_of_engagement || '');
    setFloorsQuantity(customer?.floors_quantity || '');
    setParkingLevelsQuantity(customer?.parking_levels_quantity || '');
    setParkingLotShared(customer?.parking_lot_shared || '');
    setSharedParkings(customer?.shared_parkings || '');
    setYearOfOccupancy(customer?.year_of_occupancy || new Date());
  }, [customer]);

  const body = {
    _id: id ? id : undefined,
    name,
    phone,
    email,
    city,
    address,
    contact_name: contactName,
    customer_number: customerNumber,
    description,
    building_model: buildingModel,
    terms_of_engagement: termsOfEngagement,
    floors_quantity: floorsQuantity,
    parking_levels_quantity: parkingLevelsQuantity,
    parking_lot_shared: parkingLotShared,
    shared_parkings: sharedParkings,
    year_of_occupancy: yearOfOccupancy,
  };

  const handleCloseAndSave = async () => {
    dispatch(createOrEditCustomer(body));
    updateOpenCustomer && dispatch(getCustomerInfoSuccess({ result: body }));
    handleClose(false);
  };

  return (
    <DialogPopup
      handleClose={handleClose}
      width={'40%'}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={handleClose}
      title={CREATE_CUSTOMER}
      actions={
        <PopUpButtons
          handleClose={handleClose}
          isLoading={
            !name ||
            !email ||
            !phone ||
            !contactName ||
            !customerNumber ||
            !city ||
            !address ||
            !isNameFree
          }
          handleCloseAndSave={handleCloseAndSave}
        />
      }
      content={
        <Box component="div" overflow="hidden" p={3}>
          <TextField
            fullWidth
            className={classes.inputs}
            label={CUSTOMER_NUMBER}
            variant="outlined"
            value={customerNumber}
            onChange={(e) => {
              setCustomerNumber(e.target.value);
            }}
          />
          <TextField
            fullWidth
            className={classes.inputs}
            label={isNameFree ? NAME : NAME_ALREADY_EXIST_WARNING}
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            error={!isNameFree}
          />
          <TextField
            fullWidth
            className={classes.inputs}
            label={CONTACT_NAME}
            variant="outlined"
            value={contactName}
            onChange={(e) => {
              setContactName(e.target.value);
            }}
          />
          <TextField
            fullWidth
            className={classes.inputs}
            label={PHONE}
            variant="outlined"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <TextField
            fullWidth
            className={classes.inputs}
            label={EMAIL}
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <CustomizedSelect
            label={CITY}
            value={city}
            changeHandler={setCity}
            options={israelCities}
            width={12}
          />
          <TextField
            fullWidth
            className={classes.inputs}
            label={ADDRESS}
            variant="outlined"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
          {/* ---------------------------------------------------------------------------------------------------------------- */}
          {isCurrentFactoryMetalpress() ? (
            <React.Fragment>
              <CustomizedSelect
                label={TERMS_OF_ENGAGEMENT}
                value={termsOfEngagement}
                changeHandler={setTermsOfEngagement}
                options={options?.terms_of_engagement}
                width={12}
              />
              <CustomizedSelect
                label={BUILDING_MODEL}
                value={buildingModel}
                changeHandler={setBuildingModel}
                options={options?.building_model}
                width={12}
              />
              <TextField
                fullWidth
                className={classes.inputs}
                label={PROJECT_DESCRIPTION}
                variant="outlined"
                value={description}
                multiline={true}
                onChange={(e) => setDescription(e.target.value)}
              />
              <CustomizedSelect
                label={FLOORS_QUANTITY}
                value={floorsQuantity}
                changeHandler={setFloorsQuantity}
                options={options?.quantity_of_floors}
                width={12}
              />
              <CustomizedSelect
                label={PARKING_LEVELS_QUANTITY}
                value={parkingLevelsQuantity}
                changeHandler={setParkingLevelsQuantity}
                options={options?.quantity_of_parking_levels}
                width={12}
              />
              <CustomizedSelect
                label={IS_THE_PARKING_LOT_SHARED}
                value={parkingLotShared}
                changeHandler={setParkingLotShared}
                options={options?.parking_lot_shared}
                width={12}
              />
              <CustomizedSelect
                label={SHARED_PARKINGS_FOR_A_NUMBER_OF_BUILDINGS}
                value={sharedParkings}
                changeHandler={setSharedParkings}
                options={options?.quantity_of_shared_parkings}
                width={12}
              />
              <CustomizedDatePicker
                label={YEAR_OF_OCCUPANCY}
                value={yearOfOccupancy}
                changeHandler={setYearOfOccupancy}
                width={12}
              />
            </React.Fragment>
          ) : null}
        </Box>
      }
    />
  );
};

export default CreateCustomerPopUp;
