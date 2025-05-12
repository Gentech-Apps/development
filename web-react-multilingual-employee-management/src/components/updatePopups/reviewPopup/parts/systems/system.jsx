import React, { useCallback, useState, useMemo } from 'react';
import { Grid } from '@material-ui/core';
import { ICON_WIDTH } from '../../../../../constants/review-popup';
// import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditActualSystemPopUp from '../editActualSystem/EditActualSystemPopUp';
import { setExpandedSystem } from '../../../../../actions/actions';
import { useDispatch } from 'react-redux';
import { useStyles } from './styles';
import Systems from './systems';
import { LOCATION, FLOOR } from '../../../../../constants/translations/review-popup';
import CustomizedEditIcon, { CustomizedEditIconRed } from '../../reusableComponents/editIcon';
import { SystemStatusService } from './SystemStatusService';

const System = (props) => {
  const {
    system,
    systems,
    expanded,
    setExpanded,
    editSystemHandler,
    selectSystemHandler,
    updateProcessPopupStateHandler,
    currentOrderId,
    dragHandleProps,
    draggableProps,
    innerRef,
    systemsActive /*points that testing timer started */,
  } = props;
  const {
    _id,
    layer,
    actual_system_name: actualSystemName,
    system_name: systemName,
    location_floor: locationFloor,
    location_description: locationDescription,
    check_list: checkList,
  } = system;
  const dispatch = useDispatch();

  const [openUpdateSystemPopUpHandler, setOpenUpdateSystemPopUpHandler] = useState(false);
  const [childSystems, setChildSystems] = useState([]);
  const calculateColor = () => ({
    completedStatus: SystemStatusService.createStatusGradient(
      systems,
      system,
      layer,
      systemsActive,
    ),
  });
  const doneGradient = useMemo(() => calculateColor(), [systems, systemsActive]);
  const doneStatusColor = useMemo(
    () => SystemStatusService.setProperOrNot(checkList, systemsActive),
    [checkList, systemsActive],
  );

  const classes = useStyles(doneGradient);

  const openChildSystemsHandler = () => {
    const isExpanded = expanded === _id;
    const FIRST_LAYER = 1;
    const firstLayerClosed = expanded === _id && layer === FIRST_LAYER;
    setExpanded(isExpanded ? false : _id);
    dispatch(setExpandedSystem(firstLayerClosed ? null : system));
    const nextLayer = layer + 1;
    const childLayer = systems.find((i) => i.layer === nextLayer);
    const childSystems =
      childLayer?.systems?.find((i) => i.parent_system_id === _id)?.systems || [];
    setChildSystems(childSystems);
  };

  const calculateShiftByLayer = useCallback(
    (layer) => {
      // subtract from 100% icon width and expand icon width and themn according to layer subtract layer * 1,5vw
      const width = `calc(100% - ${ICON_WIDTH} - ${ICON_WIDTH} - (${layer > 1 ? layer * 2 : 0}vw))`;
      const styles = { width };
      return styles;
    },
    [ICON_WIDTH],
  );

  const openCheckListHandler = (e) => {
    e.stopPropagation();
    selectSystemHandler(system);
  };

  const editSystem = (e, system) => {
    e.stopPropagation();
    setOpenUpdateSystemPopUpHandler(true);
    editSystemHandler(e, system);
  };

  const createSystemDescription = () => {
    const description =
      systemName +
      ' ' +
      actualSystemName +
      ' ' +
      (locationFloor ? FLOOR + ' ' + locationFloor + ' ' : ' ') +
      (locationDescription ? LOCATION + ' ' + locationDescription + ' ' : ' ');
    return description;
  };

  return (
    <Grid className={classes.systemWrapper} ref={innerRef} {...draggableProps}>
      <Accordion
        classes={{ root: classes.MuiAccordionroot }}
        className={classes.lastChildNotBorderRadius}
        expanded={expanded === _id}
        disabled={!systemsActive}
        // onChange={handleExpand(_id)}
        elevation={0}
      >
        <AccordionSummary
          // onClick={openChildSystemsHandler}
          classes={{ root: classes.AccordionSummaryRoot, content: classes.AccordionSummaryRoot }}
          expandIcon={
            <ExpandMoreIcon
              style={{ color: doneStatusColor, fontSize: '50px' }}
              onClick={openChildSystemsHandler}
            />
          }
          {...dragHandleProps}
        >
          {doneStatusColor === 'red' ? (
            <CustomizedEditIconRed
              clickHandler={(e) => editSystem(e, system)}
              style={SystemStatusService.setIconTransparent(systemsActive)}
            />
          ) : (
            <CustomizedEditIcon
              clickHandler={(e) => editSystem(e, system)}
              style={SystemStatusService.setIconTransparent(systemsActive)}
            />
          )}
          <Typography
            classes={{ root: classes.systemInfo }}
            style={{
              ...calculateShiftByLayer(layer),
              fontWeight: expanded === _id ? '600' : '500',
              position: 'relative',
            }}
            onClick={(e) => openCheckListHandler(e)}
          >
            {createSystemDescription()}
          </Typography>
        </AccordionSummary>
        {expanded ? (
          <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
            <Systems
              systemLayers={systems}
              currentSystems={childSystems}
              editSystemHandler={editSystemHandler}
              selectSystemHandler={selectSystemHandler}
              systemsActive={systemsActive}
              currentLayer={layer + 1} /*add 1 to increase layer for child systems */
              selectedSystemId={_id}
              updateProcessPopupStateHandler={updateProcessPopupStateHandler}
              currentOrderId={currentOrderId}
              // updateSystems={updateSystems}
            />
          </AccordionDetails>
        ) : null}
      </Accordion>
      {openUpdateSystemPopUpHandler && (
        <EditActualSystemPopUp
          data={system}
          isOpen={openUpdateSystemPopUpHandler}
          handleClose={() => setOpenUpdateSystemPopUpHandler(false)}
          updateProcessPopupStateHandler={updateProcessPopupStateHandler}
        />
      )}
    </Grid>
  );
};

export default System;
