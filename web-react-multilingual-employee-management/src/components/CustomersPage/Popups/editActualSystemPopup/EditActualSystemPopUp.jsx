import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { useStyles } from './styles';
import { editSystem } from '../../../../functions/api/systems';
import { Box } from '@material-ui/core';
import { useGeneralSection } from '../../../../hooks/useGeneralSection';
import SystemsGeneralSection from './EditGeneralSection';
import { updateGeneralSection } from '../../../../functions/api/orders';
import DeleteConfirmationPopUp from '../../../reused-components/DeleteConfirmationPopUp';
import DialogPopup from '../../../reused-components/DialogPopup/dialogPopup';
import { SYSTEM_DETAILS } from '../../../../constants/translations/review-popup';
import CustomizedButton from '../../reused_components/customizedButton';
import {
  WHITE_COLOR,
  CLOSE_BUTTON_BACKGROUND,
  BLUE_COLOR,
  LIGHT_BLUE,
} from '../../../../constants/review-popup';
import { SAVE, CANCEL, DELETE } from '../../../../constants/translations/review-popup';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { calculatePopupWidth, calculateButtonWidth } from '../../../../utils';
import {
  getChildSystems,
  getFirstLayerSystems,
  deleteActualSystem,
} from '../../../../functions/api/customer-page';

const EditActualSystemPopUp = (props) => {
  const windowWidth = useSelector((state) => state.pageInfo.width);
  const { data, isOpen, handleClose, updateSystem, handleSystemDelete } = props;
  const {
    parent_system_id: parentSystemId,
    customer_id,
    actual_system_name,
    location_floor,
    location_description,
    _id,
  } = data;

  const classes = useStyles();

  const [actualSystemName, setActualSystemName] = useState(actual_system_name);
  const [actualLocationFloor, setActualLocationFloor] = useState(location_floor);
  const [actualLocationDescription, setActualLocationDescription] = useState(location_description);
  const [generalSection, setGeneralSection] = useGeneralSection(_id, customer_id);
  const [isConfirmDeletePopUpOpen, setConfirmDeletePopUpOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const body = {
    actual_system_id: _id,
    customer_id,
    actual_system_name: actualSystemName,
    location_floor: actualLocationFloor,
    location_description: actualLocationDescription,
  };

  const handleEditSystem = async () => {
    try {
      const data = { ...generalSection };
      setLoader((prev) => !prev);
      await Promise.all([editSystem(body), updateGeneralSection(data)]);
      // if parent system id === null need to get first layer systems
      const childSystems = parentSystemId
        ? await getChildSystems(parentSystemId)
        : await getFirstLayerSystems(customer_id);
      // updateSiblings(childSystems)
      setLoader((prev) => !prev);
      updateSystem(childSystems);
    } catch (e) {
      console.log(e);
    }
    handleClose();
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

  const deleteSystem = async (actual_system_id) => {
    // const responce = await deleteActualSystem(actual_system_id)
    // if (responce) {
    //   updateSystem(responce)
    // }
    handleSystemDelete(actual_system_id);
    handleClose();
  };

  return (
    <DialogPopup
      handleClose={handleClose}
      width={calculatePopupWidth(windowWidth)}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={handleClose}
      title={SYSTEM_DETAILS}
      actions={
        <EditSystemActions
          deleteHandler={() => setConfirmDeletePopUpOpen(true)}
          cancelHandler={handleClose}
          saveHandler={handleEditSystem}
          loader={loader}
        />
      }
      content={
        <React.Fragment>
          <Box container={'true'} p={3}>
            <TextField
              fullWidth
              label="שם מערכת"
              variant="outlined"
              value={actualSystemName}
              className={classes.inputs}
              onChange={changeNameHandler}
            />
            <TextField
              fullWidth
              label="קומה"
              variant="outlined"
              value={actualLocationFloor}
              className={classes.inputs}
              onChange={changeLocationFloorHandler}
            />
            <TextField
              fullWidth
              label="תיאור מיקום"
              variant="outlined"
              value={actualLocationDescription}
              className={classes.inputs}
              onChange={changeLocationDescriptionHandler}
            />
            {generalSection ? (
              <SystemsGeneralSection
                systemsGeneralSection={generalSection}
                setSystemsGeneralSection={setGeneralSection}
              />
            ) : null}
          </Box>
          {isConfirmDeletePopUpOpen && (
            <DeleteConfirmationPopUp
              okCallback={() => deleteSystem(_id)}
              cancelCallback={() => setConfirmDeletePopUpOpen(false)}
              isOpen={isConfirmDeletePopUpOpen}
            />
          )}
        </React.Fragment>
      }
    />
  );
};

const EditSystemActions = (props) => {
  const windowWidth = useSelector((state) => state.pageInfo.width);
  const buttonWidth = calculateButtonWidth(windowWidth);
  const { deleteHandler, cancelHandler, saveHandler, loader } = props;
  return (
    <Grid style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <CustomizedButton
        backgroundColor={BLUE_COLOR}
        textColor={WHITE_COLOR}
        text={SAVE}
        clickHandler={saveHandler}
        width={buttonWidth}
        loading={loader}
      />
      <CustomizedButton
        backgroundColor={CLOSE_BUTTON_BACKGROUND}
        textColor={WHITE_COLOR}
        text={CANCEL}
        clickHandler={cancelHandler}
        width={buttonWidth}
        loading={false}
      />
      <CustomizedButton
        backgroundColor={LIGHT_BLUE}
        textColor={BLUE_COLOR}
        text={DELETE}
        clickHandler={deleteHandler}
        width={buttonWidth}
        loading={false}
      />
    </Grid>
  );
};

export default EditActualSystemPopUp;
