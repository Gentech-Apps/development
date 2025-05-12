import React, { useState } from 'react';
import { generalPostRequest } from '../../../../../functions/api/general';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { useStyles } from './addNewActualsystem.styles';
import { Box } from '@material-ui/core';
import { useGetSystemsRelatedToLayer } from '../../../../../hooks/useGetSystemsRelatedToLayer';
import { CUSTOMERS_PAGE, SYSTEM_TYPES } from '../../../../../constants/translations/customersPage';
import DialogPopup from '../../../../reused-components/DialogPopup/dialogPopup';
import { SYSTEM_DETAILS } from '../../../../../constants/translations/review-popup';
import CustomizedButton from '../../reusableComponents/customizedButton';
import {
  WHITE_COLOR,
  CLOSE_BUTTON_BACKGROUND,
  BLUE_COLOR,
} from '../../../../../constants/review-popup';
import { SAVE, CANCEL } from '../../../../../constants/translations/review-popup';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { calculatePopupWidth, calculateButtonWidth } from '../../../../../utils';
import { CACHED_CHECK_LISTS_DATA } from '../../../../../constants/offline-mode';

const CreateSystemPopup = (props) => {
  // const { BUILDING, PARKING, SYSTEM_TYPE, OTHER } = SYSTEM_TYPES
  const {
    ACTUAL_SYSTEM_NAME,
    LOCATION_FLOOR,
    LOCATION_DESCRIPTION,
    QUANTITY,
    QUANTITY_MSG,
  } = CUSTOMERS_PAGE;
  const {
    customer_id,
    order_id,
    updateProcessPopupStateHandler,
    // selectedSystemId,
    isOpen,
    handleClose,
  } = props;
  const parentSystem = useSelector((state) => state?.reviewPopup?.expandedSystem);
  const windowWidth = useSelector((state) => state.pageInfo.width);

  const selectedSystemId =
    parentSystem?._id || null; /*null for first layer systems, they don't have parent system */
  const currentLayer = parentSystem?.layer
    ? parentSystem?.layer + 1
    : 1; /*1 for first layer systems, because parent system is null */
  // const customer_id = parentSystem?.customer_id

  const classes = useStyles();
  const templateSystems = useGetSystemsRelatedToLayer(currentLayer);

  const [systemId, setSystemId] = useState('');
  const [actualSystemName, setActualSystemName] = useState('');
  const [actualLocationFloor, setActualLocationFloor] = useState('');
  const [actualLocationDescription, setActualLocationDescription] = useState('');
  const [systemName, setSystemName] = useState('');
  const [systemType, setSystemType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityLabel, setQuantitylabel] = useState(QUANTITY_MSG);

  const newActualSystemBody = {
    system_id: systemId,
    system_name: systemName,
    actual_system_name: actualSystemName,
    location_floor: actualLocationFloor,
    location_description: actualLocationDescription,
    system_type: systemType,
    order_id,
    parent_system_id: selectedSystemId,
    layer: currentLayer,
    customer_id,
    quantity_for_bulk: quantity || '1',
  };

  const handleAddSystem = async () => {
    const responce = await generalPostRequest(
      newActualSystemBody,
      `/system/order-systems/create-actual-system`,
    );
    if (responce?.result) {
      // const data = addSystemMobileHandler(selectedSystemId, result)
      localStorage.setItem(CACHED_CHECK_LISTS_DATA, JSON.stringify(responce));
      updateProcessPopupStateHandler({ systemLayers: responce.result });
      handleClose();
    }
  };

  const handleChangeSelectedSystem = (e) => {
    setSystemId(e.target.value);
    setSystemName(e.currentTarget.innerText);
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

  const handleChangeSystemType = (e) => {
    setSystemType(e.target.value);
  };

  const changeQuantityHandler = (e) => {
    setQuantity(e.target.value);
  };

  const handleQuantityText = () => {
    setQuantitylabel(QUANTITY);
  };

  const handleQuantityText2 = () => {
    setQuantitylabel(QUANTITY_MSG);
  };

  return (
    <DialogPopup
      handleClose={handleClose}
      width={calculatePopupWidth(windowWidth)}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={handleClose}
      title={SYSTEM_DETAILS}
      actions={<Actions cancelHandler={handleClose} saveHandler={handleAddSystem} />}
      content={
        <Box container={'true'} p={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="select-add-new-actual-system">הוסף מערכת</InputLabel>
            <Select
              className={classes.inputs}
              id="select-add-new-actual-system"
              onChange={handleChangeSelectedSystem}
              value={systemId || ''}
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
          {/* <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor='system-type'>{SYSTEM_TYPE}</InputLabel>
        <Select className={classes.inputs}
          id='system-type'
          onChange={handleChangeSystemType}
          value={systemType}
        >
          <MenuItem value={''}>{''}</MenuItem>
          <MenuItem value={BUILDING}>{BUILDING}</MenuItem>
          <MenuItem value={PARKING}>{PARKING}</MenuItem>
          <MenuItem value={OTHER}>{OTHER}</MenuItem>
        </Select>
      </FormControl> */}
          <TextField
            type="number"
            label={quantityLabel}
            variant="outlined"
            value={quantity}
            className={classes.inputs}
            onChange={changeQuantityHandler}
            onFocus={handleQuantityText}
            onBlur={handleQuantityText2}
          />
          <TextField
            fullWidth
            label={ACTUAL_SYSTEM_NAME}
            variant="outlined"
            value={actualSystemName}
            className={classes.inputs}
            onChange={changeNameHandler}
          />
          <TextField
            fullWidth
            label={LOCATION_FLOOR}
            variant="outlined"
            value={actualLocationFloor}
            className={classes.inputs}
            onChange={changeLocationFloorHandler}
          />
          <TextField
            fullWidth
            label={LOCATION_DESCRIPTION}
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

const Actions = (props) => {
  const { cancelHandler, saveHandler } = props;
  const windowWidth = useSelector((state) => state.pageInfo.width);
  const buttonWidth = calculateButtonWidth(windowWidth);

  return (
    <Grid style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <CustomizedButton
        backgroundColor={BLUE_COLOR}
        textColor={WHITE_COLOR}
        text={SAVE}
        clickHandler={saveHandler}
        width={buttonWidth}
      />
      <CustomizedButton
        backgroundColor={CLOSE_BUTTON_BACKGROUND}
        textColor={WHITE_COLOR}
        text={CANCEL}
        clickHandler={cancelHandler}
        width={buttonWidth}
      />
    </Grid>
  );
};

export default CreateSystemPopup;
