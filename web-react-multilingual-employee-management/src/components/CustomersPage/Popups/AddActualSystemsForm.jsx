import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { useStyles } from './styles';
import { Box } from '@material-ui/core';
import PopUpButtons from '../reused_components/PopUpButtons';
import { SYSTEM_TYPES, CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import { generalPostRequest } from '../../../functions/api/general';
import { useGetSystemsRelatedToLayer } from '../../../hooks/useGetSystemsRelatedToLayer';
import { useSelector } from 'react-redux';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';
import { SYSTEM_DETAILS } from '../../../constants/translations/review-popup';

const AddActualSystemsForm = ({ customerId, isOpen, closePopUpHandler }) => {
  const {
    ACTUAL_SYSTEM_NAME,
    LOCATION_FLOOR,
    LOCATION_DESCRIPTION,
    QUANTITY,
    QUANTITY_MSG,
  } = CUSTOMERS_PAGE;

  const classes = useStyles();

  const [selectedSystemId, setSelectedSystemId] = useState('');
  const [actualSystemName, setActualSystemName] = useState('');
  const [actualLocationFloor, setActualLocationFloor] = useState('');
  const [actualLocationDescription, setActualLocationDescription] = useState('');
  const [quantityBulkCreate, setQuantityBulkCreate] = useState('');
  const [systemType, setSystemType] = useState('');
  const [quantityLabel, setQuantitylabel] = useState(QUANTITY_MSG);

  const customerState = useSelector((state) => state.customersPage);
  const {
    parentSystemId: actualSystemId,
    layer: systemLayer,
    updateSystems: updateSystemsHandler,
  } = customerState;

  const templateSystems = useGetSystemsRelatedToLayer(systemLayer);

  const createSystemBody = () => {
    const newActualSystemBody = {
      quantity_for_bulk: quantityBulkCreate || 1 /* if quantity doesn't set => create one system */,
      system_id: selectedSystemId,
      actual_system_name: actualSystemName,
      location_floor: actualLocationFloor,
      location_description: actualLocationDescription,
      system_type: systemType,
      parent_system_id: actualSystemId,
      customer_id: customerId,
      layer: systemLayer,
    };

    return newActualSystemBody;
  };

  const inputsCleaner = () => {
    setSelectedSystemId('');
    setActualSystemName('');
    setActualLocationFloor('');
    setActualLocationDescription('');
    setQuantityBulkCreate('');

    closePopUpHandler();
  };

  const handleAddSystem = async () => {
    const systemBody = createSystemBody();
    const responce = await generalPostRequest(
      systemBody,
      `/system/customer-page/add-new-actual-system`,
    );
    const systems = responce?.result || [];
    updateSystemsHandler(systems);
    inputsCleaner();
  };

  const handleChangeSelectedSystem = (e) => {
    setSelectedSystemId(e.target.value);
  };

  const changeNameHandler = (e) => {
    setActualSystemName(e.target.value);
  };

  const changeLocationDescriptionHandler = (e) => {
    setActualLocationDescription(e.target.value);
  };

  const changeLocationFloorHandler = (e) => {
    setActualLocationFloor(e.target.value);
  };

  const changeQuantityHandler = (e) => {
    setQuantityBulkCreate(e.target.value);
  };

  const handleQuantityText = () => {
    setQuantitylabel(QUANTITY);
  };

  const handleQuantityText2 = () => {
    setQuantitylabel(QUANTITY_MSG);
  };

  return (
    <DialogPopup
      handleClose={inputsCleaner}
      width={'40%'}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={inputsCleaner}
      title={SYSTEM_DETAILS}
      actions={
        <PopUpButtons
          handleClose={inputsCleaner}
          isLoading={!selectedSystemId}
          handleCloseAndSave={handleAddSystem}
        />
      }
      content={
        <Box container={'true'} p={5}>
          <FormControl variant="outlined" className={classes.inputs}>
            <InputLabel htmlFor="select-add-new-actual-system">הוסף מערכת</InputLabel>
            <Select
              id="select-add-new-actual-system"
              onChange={handleChangeSelectedSystem}
              value={selectedSystemId}
            >
              {templateSystems.length ? (
                templateSystems.map((i) => (
                  <MenuItem key={i._id} value={i._id}>
                    {i.description}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={''}></MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            type="number"
            label={quantityLabel}
            variant="outlined"
            value={quantityBulkCreate}
            className={classes.inputs}
            onChange={changeQuantityHandler}
            onFocus={handleQuantityText}
            onBlur={handleQuantityText2}
          />
          <TextField
            label={ACTUAL_SYSTEM_NAME}
            disabled={quantityBulkCreate ? true : false}
            variant="outlined"
            value={actualSystemName}
            className={classes.inputs}
            onChange={changeNameHandler}
          />
          <TextField
            label={LOCATION_FLOOR}
            disabled={quantityBulkCreate ? true : false}
            variant="outlined"
            value={actualLocationFloor}
            className={classes.inputs}
            onChange={changeLocationFloorHandler}
          />
          <TextField
            label={LOCATION_DESCRIPTION}
            disabled={quantityBulkCreate ? true : false}
            variant="outlined"
            value={actualLocationDescription}
            className={classes.inputs}
            onChange={changeLocationDescriptionHandler}
          />
        </Box>
      }
    />
  );
};

export default AddActualSystemsForm;
