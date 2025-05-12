import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import { ICON_WIDTH } from '../../../constants/review-popup';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditActualSystemPopUp from '../Popups/editActualSystemPopup/EditActualSystemPopUp';
import { getCustomerInfoById, setExpandedSystem } from '../../../actions/actions';
import { useDispatch } from 'react-redux';
import { useStyles } from './styles';
import Systems from './systems';
import { LOCATION, FLOOR } from '../../../constants/translations/review-popup';
import CustomizedEditIcon, { CustomizedEditIconRed } from '../reused_components/CustomizedEditIcon';
import {
  deleteSystems,
  duplicateSystems,
  getChildSystems,
  updateSystems,
} from '../../../functions/api/customer-page';
import { setCallbackAndCredentialsForAddingSystem } from '../../../actions/actions';
import { SystemStatusService } from './SystemStatusService';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SystemEditDialog from '../Popups/SystemEditDialog';
import SystemConfirmationPopUp from '../../reused-components/SystemConfirmationPopUp';
import MoveSystemLevel from '../Popups/MoveSystemLevel';
import { useRef } from 'react';

const System = (props) => {
  const {
    system,
    expanded,
    setExpanded,
    selectSystemHandler,
    dragHandleProps,
    draggableProps,
    innerRef,
    updateSiblings /*after close layer update callback for updating closed layer systems */,
    systemCheckList,
    allSystemsLayer,
    systems,
    customer,
    system_close_ref,
    setSystemCloseRef,
  } = props;

  let {
    _id,
    layer,
    actual_system_name: actualSystemName,
    system_name: systemName,
    location_floor: locationFloor,
    location_description: locationDescription,
  } = system;
  const [open, setOpen] = useState('');
  const calculateColor = () => ({
    completedStatus: SystemStatusService.createStatusGradient(
      allSystemsLayer,
      systemCheckList,
      layer,
      true,
    ),
  });
  const doneGradient = useMemo(() => calculateColor(), [systemCheckList.check_list]);
  const dispatch = useDispatch();
  const doneStatusColor = useMemo(
    () => SystemStatusService.setProperOrNot(systemCheckList.check_list, true),
    [systemCheckList.check_list],
  );
  const [openUpdateSystemPopUpHandler, setOpenUpdateSystemPopUpHandler] = useState(false);
  const [isConfirmationPopUpOpen, setConfirmationPopUpOpen] = useState(false);
  const [childSystems, setChildSystems] = useState([]);
  const classes = useStyles(doneGradient);
  const [openMoveSystemPopup, setOpenMoveSystemPopup] = useState(false);
  const confirmation_ref = useRef({});
  const [systemEdit, setSystemEdit] = useState({
    status: false,
    message: '',
    data: [],
    count: 0,
  });

  const openChildSystemsHandler = async () => {
    const isExpanded = expanded === _id;
    // update data for adding systems
    const { _id: systemId, layer, parent_system_id } = system;
    const data = {
      /*if system expanded child systems should be updated, else if closed this layer should be updated */
      updateSystems: isExpanded ? updateSiblings : setChildSystems,
      parentSystemId: isExpanded ? parent_system_id : systemId,
      layer: isExpanded ? layer : layer + 1,
    };

    dispatch(setCallbackAndCredentialsForAddingSystem(data));

    // -------------------------------------------------
    const FIRST_LAYER = 1;
    const firstLayerClosed = expanded === _id && layer === FIRST_LAYER;
    setExpanded(isExpanded ? null : _id);
    dispatch(setExpandedSystem(firstLayerClosed ? null : system));
    const childSystems = await getChildSystems(_id);
    setChildSystems(childSystems);
  };

  useEffect(() => {
    setSystemCloseRef({ _id: _id, value: openChildSystemsHandler });
  }, []);

  const calculateShiftByLayer = useCallback(
    (layer) => {
      // subtract from 100% icon width and expand icon width and themn according to layer subtract layer * 1,5vw
      const width = `calc(100% - ${ICON_WIDTH} - (${layer * 2}vw))`;
      const styles = { width };
      return styles;
    },
    [ICON_WIDTH],
  );

  const editSystem = (e, system) => {
    e.stopPropagation();
    setOpenUpdateSystemPopUpHandler(true);
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

  const handleSystemDelete = () => {
    (async () => {
      const { ok, result } = await deleteSystems(_id);
      let layer = result?.data?.layer || 0;
      if (ok && layer != 1) {
        const childSystems = await getSystemsChild(result.data.parent_system_id);
        setSystemEdit({ message: result.message, status: true, data: childSystems });
      } else {
        setSystemEdit({
          message: result.message,
          status: true,
          data: layer === 1 ? [result.data.layer] : [],
        });
      }
    })();
  };

  const handleView = () => {
    if (systemEdit.data.length > 0 && systemEdit.data[0] === 1) {
      customer._id && dispatch(getCustomerInfoById(customer._id, 5));
    } else if (systemEdit.data.length > 0) {
      updateSiblings([...systemEdit.data]);
    } else if (systemEdit?.expand) {
      systemEdit.expandSystem();
      if (systemEdit.parent_system) system_close_ref.current[systemEdit.parent_system]();
    }
  };

  const handleSystemDuplicate = (system_id) => {
    (async () => {
      const { ok, result } = await duplicateSystems(system_id);
      let layer = result?.data?.layer || 0;
      let count_data = result.duplicated_system_count || 0;
      if (ok && layer != 1) {
        const childSystems = await getSystemsChild(result.data.parent_system_id);
        setSystemEdit({
          message: result.message,
          status: true,
          data: childSystems,
          count: count_data,
        });
      } else {
        setSystemEdit({
          ...systemEdit,
          message: result.message,
          status: true,
          data: layer === 1 ? [result.data.layer] : [],
          count: count_data,
        });
      }
    })();
  };

  const getSystemsChild = async (_id) => await getChildSystems(_id);

  const systemUpdateCall = async (data) => {
    const { result, parent_system, message } = data;
    if (result) {
      setSystemEdit({
        ...systemEdit,
        message: message,
        status: true,
        expand: true,
        parent_system,
        expandSystem: system_close_ref.current[result._id],
      });
    }
  };

  return (
    <Grid className={classes.systemWrapper} ref={innerRef} {...draggableProps}>
      <Accordion
        classes={{ root: classes.MuiAccordionroot }}
        className={classes.lastChildNotBorderRadius}
        expanded={expanded === _id}
        elevation={0}
      >
        <AccordionSummary
          classes={{ root: classes.AccordionSummaryRoot, content: classes.AccordionSummaryRoot }}
          expandIcon={
            <ExpandMoreIcon
              style={{ color: doneStatusColor, fontSize: '50px' }}
              onClick={openChildSystemsHandler}
            />
          }
          {...dragHandleProps}
          style={{ width: '100%' }}
        >
          <IconButton style={{ padding: '0px 4px' }} onClick={(e) => setOpen(e.currentTarget)}>
            <MoreVertIcon
              fontSize="large"
              style={{
                color: '#0091ff',
                cursor: 'pointer',
              }}
            />
          </IconButton>
          <Menu anchorEl={open} keepMounted open={!!open} onClose={() => setOpen('')}>
            <MenuItem
              style={{ fontSize: '1rem' }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen('');
                handleSystemDuplicate(system);
              }}
            >
              {'שכפל'}
            </MenuItem>
            <MenuItem
              style={{ fontSize: '1rem' }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen('');
                setConfirmationPopUpOpen(true);
                confirmation_ref.current = { callBack: handleSystemDelete };
              }}
            >
              {'מחק'}
            </MenuItem>
            {layer > 1 && (
              <MenuItem
                style={{ fontSize: '1rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen('');
                  setOpenMoveSystemPopup(true);
                }}
              >
                {'העבר'}
              </MenuItem>
            )}
          </Menu>
          {doneStatusColor === 'red' ? (
            <CustomizedEditIconRed clickHandler={(e) => editSystem(e, system)} />
          ) : (
            <CustomizedEditIcon clickHandler={(e) => editSystem(e, system)} />
          )}

          <Typography
            classes={{
              root: window.location.href.includes('customers-page')
                ? classes.customerPageSystemInfo
                : classes.systemInfo,
            }}
            style={{
              ...calculateShiftByLayer(layer),
              fontWeight: expanded === _id ? '600' : '500',
              position: 'relative',
            }}
          >
            {createSystemDescription()}
          </Typography>
        </AccordionSummary>
        {expanded === _id ? (
          <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
            <Systems
              systems={childSystems}
              selectSystemHandler={selectSystemHandler}
              currentLayer={layer + 1} //add 1 to increase layer for child systems
              selectedSystemId={_id}
              updateSiblings={setChildSystems} // after close layer update callback for updating closed layer systems
              customer={customer}
              system_close_ref={system_close_ref}
              setSystemCloseRef={setSystemCloseRef}
            />
          </AccordionDetails>
        ) : null}
      </Accordion>
      {openUpdateSystemPopUpHandler && (
        <EditActualSystemPopUp
          data={system}
          isOpen={openUpdateSystemPopUpHandler}
          handleClose={() => setOpenUpdateSystemPopUpHandler(false)}
          updateSystem={updateSiblings}
          handleSystemDelete={handleSystemDelete}
        />
      )}
      {systemEdit.status && (
        <SystemEditDialog
          isOpen={systemEdit.status}
          count={systemEdit.count}
          closeHandler={() => {
            setSystemEdit({ ...systemEdit, status: false });
            (systemEdit?.data.length != 0 || systemEdit?.expand) && handleView();
          }}
          message={systemEdit.message}
        />
      )}
      {isConfirmationPopUpOpen && (
        <SystemConfirmationPopUp
          okCallback={confirmation_ref.current.callBack}
          cancelCallback={() => {
            setConfirmationPopUpOpen(false);
            confirmation_ref.current.callBack = null;
          }}
          isOpen={isConfirmationPopUpOpen}
        />
      )}
      {openMoveSystemPopup && (
        <MoveSystemLevel
          isOpen={openMoveSystemPopup}
          handleClosePopup={setOpenMoveSystemPopup}
          customer_id={customer?._id}
          system_id={_id}
          system={system}
          systemUpdated={systemUpdateCall}
        />
      )}
    </Grid>
  );
};

export default System;
