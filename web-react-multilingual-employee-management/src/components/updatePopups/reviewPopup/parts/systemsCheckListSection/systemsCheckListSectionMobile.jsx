import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import {
  uploadPhoto,
  updateActualSystemCheckListSectionMobile,
} from '../../../../functions/api/orders';
import Loader from '../../../LoaderNew/Loader';
import { API } from '../../../../tools/keys/keys';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import { inputComponentCreator } from '../reusableComponentsForSections/tools';
import { checkListSection } from '../../../../constants/responsive-pop-up';
import Dialog from '@material-ui/core/Dialog';
import {
  CHECK_LIST_TRANSLATION,
  CUSTOMERS_PAGE,
} from '../../../../constants/translations/customersPage';
import { editCheckListHandler } from '../../../../functions/helpers/offline-mode/editCheckListHandler';
import TestIcon from './parts/TestIcon';

function SystemsCheckListSectionMobile(props) {
  const { PROPER, ALL_RIGHT } = CHECK_LIST_TRANSLATION;
  const { CANCEL } = CUSTOMERS_PAGE;
  const {
    systemsCheckListData,
    updateProcessPopupStateHandler,
    setSystemsChecklistViewable,
    isCheckListShown,
    updateSystems,
    selectedSystemId,
    layer,
  } = props;

  const { data: inputsData } = systemsCheckListData;

  const [isLoadButton, setIsLoadButton] = useState(false);
  const [testNumber, setTestNumber] = useState(0);

  const increaseTestNumberHandler = () => {
    setTestNumber((i) => ++i);
  };

  const decreaseTestNumberHandler = () => {
    setTestNumber((i) => --i);
  };

  const setValueHandler = (rowIdx, colIdx, value) => {
    const systemChecklistSection = { ...systemsCheckListData };
    systemChecklistSection.data[rowIdx].values[colIdx].value = value;
    if (colIdx === 1) {
      const selectedValue = systemChecklistSection.data[rowIdx].values[colIdx].value;
      const options = systemChecklistSection.data[rowIdx].values[colIdx].options;
      if (typeof selectedValue === 'string') {
        // const actionValue = findActionForOption(options, selectedValue)
        const { action: actionValue } = findShowStopperAndAction(options, selectedValue);
        // set recommended action for next column
        systemChecklistSection.data[rowIdx].values[colIdx + 1].value = actionValue;
      } else if (Array.isArray(selectedValue)) {
        const actionsArray = [];
        const showStoppers = [];
        selectedValue.forEach((option) => {
          const { action, showStopper } = findShowStopperAndAction(options, option);
          action && actionsArray.push(action);
          showStopper && showStoppers.push(showStopper);
        });
        const actions = actionsArray.join(',');
        const show_stopper = showStoppers.join(',');
        systemChecklistSection.data[rowIdx].values[colIdx + 1].value = actions;
        systemChecklistSection.data[rowIdx].show_stopper = show_stopper;
      }
    }
    updateProcessPopupStateHandler({ systemChecklistSection });
  };

  const findShowStopperAndAction = (options, selectedValue) => {
    const option = options.find((i) => i.option === selectedValue);
    const action = option?.action || '';
    const showStopper = option?.show_stopper || '';
    return { action, showStopper };
  };

  const removeFileHandler = (rowIdx, colIdx, link) => {
    const systemChecklistSection = { ...systemsCheckListData };
    const indexOfElement = systemChecklistSection.data[rowIdx].values[colIdx].value.indexOf(link);
    systemChecklistSection.data[rowIdx].values[colIdx].value.splice(indexOfElement, 1);
    updateProcessPopupStateHandler({ systemChecklistSection });
  };

  const uploadPhotoHandler = async (rowIdx, colIdx, element) => {
    const formData = new FormData();
    formData.append('photo', element.files[0]);
    const { result } = await uploadPhoto(formData);
    const link = `${API}${result}`;
    const systemChecklistSection = { ...systemsCheckListData };
    systemChecklistSection.data[rowIdx].values[colIdx].value.push(link);
    updateProcessPopupStateHandler({ systemChecklistSection });
  };

  const updateCheckListDataHandler = async () => {
    setIsLoadButton(!isLoadButton);
    let responce = await updateActualSystemCheckListSectionMobile(systemsCheckListData);
    const checkList = responce?.result;
    // change edited check list in local storage and set new systems list (currentSystems) in UpdateProccessPopup
    const systemsList = editCheckListHandler(layer, selectedSystemId, checkList);
    updateSystems(systemsList);
    // }
    setIsLoadButton(!isLoadButton);
    setSystemsChecklistViewable();
  };

  const setAllTestsStatusOk = () => {
    const systemChecklistSection = { ...systemsCheckListData };
    systemChecklistSection.data.forEach((i) => (i.values[0].value = PROPER));
    updateProcessPopupStateHandler({ systemChecklistSection });
    updateCheckListDataHandler();
  };

  return inputsData ? (
    <Dialog
      open={isCheckListShown}
      onClose={setSystemsChecklistViewable}
      fullScreen={true}
      fullWidth={true}
      PaperProps={{
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box container={'true'} p={2}>
        <TestIcon link={inputsData[testNumber].icon} />
        <Typography variant="h6" gutterBottom>
          {inputsData[testNumber].row_title}
        </Typography>
        {systemsCheckListData.data[testNumber].values &&
          systemsCheckListData.data[testNumber].values.map((i, rowIdx) => {
            const row = systemsCheckListData.data[testNumber].values;
            return inputComponentCreator(
              i,
              testNumber,
              rowIdx,
              checkListSection,
              setValueHandler,
              uploadPhotoHandler,
              removeFileHandler,
              row,
            );
          })}
      </Box>
      <section className="custom__popup__mobile__submit-section">
        {testNumber > 0 ? (
          <ArrowForwardIcon
            color="primary"
            onClick={testNumber > 0 ? decreaseTestNumberHandler : null}
          />
        ) : (
          <span
            className={'link_button'}
            onClick={setAllTestsStatusOk}
            style={{ color: '#0091FF' }}
          >
            {ALL_RIGHT}
          </span>
        )}
        <button onClick={setSystemsChecklistViewable}>{CANCEL}</button>
        {testNumber === inputsData.length - 1 ? (
          <button onClick={() => updateCheckListDataHandler()}>
            {isLoadButton ? <Loader /> : 'שמור'}
          </button>
        ) : (
          <ArrowBackIcon color={'primary'} onClick={increaseTestNumberHandler} />
        )}
      </section>
    </Dialog>
  ) : null;
}

export default SystemsCheckListSectionMobile;
