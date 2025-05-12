import React, { useRef, useState } from 'react';
import { Table, TableContainer, Grid, Paper } from '@material-ui/core';
import {
  uploadPhoto,
  updateActualSystemCheckListSectionMobile,
  processFailedUpdateActualSystemRequests,
  updateUnionChecklist,
} from '../../../../../functions/api/orders';
// import Loader from "../../../LoaderNew/Loader"
import { API } from '../../../../../tools/keys/keys';
import { useStyles } from './styles';
import SystemsCheckListSectionTableHead from './parts/tableHead';
import { CHECK_LIST_TRANSLATION } from '../../../../../constants/translations/customersPage';
import SystemsCheckListSectionTableBody from './parts/TableBody';
import { editCheckListHandler } from '../../../../../functions/helpers/offline-mode/editCheckListHandler';
import DialogPopup from '../../../../reused-components/DialogPopup/dialogPopup';
import {
  VISUAL_INSPECTION,
  ALL_RIGHT,
  SAVE,
  CANCEL,
  NON_CRIRTICAL_FAULT_SHOW_STOPPER,
  PROPER,
} from '../../../../../constants/translations/review-popup';
import CustomizedButton from '../../reusableComponents/customizedButton';
import {
  BLUE_COLOR,
  LIGHT_BLUE,
  WHITE_COLOR,
  CLOSE_BUTTON_BACKGROUND,
} from '../../../../../constants/review-popup';
import {
  CACHED_CHECK_LISTS_DATA,
  DELAYED_CHECK_LIST_DATA,
} from '../../../../../constants/offline-mode';
import { calculateButtonWidth } from '../../../../../utils';
import { useSelector } from 'react-redux';
import { CheckListService } from './services';
import { useEffect } from 'react';

function SystemsCheckListSection(props) {
  const { PROPER, ALL_RIGHT, IMAGE_UPLOAD_ERROR_MESSAGE } = CHECK_LIST_TRANSLATION;
  const classes = useStyles();
  const {
    systemsCheckListData,
    updateProcessPopupStateHandler,
    setSystemsChecklistViewable,
    updateSystemsListHandler,
    selectedSystemId,
    layer,
    title = VISUAL_INSPECTION,
    updateUnionSystemsGoodNotGoodStatus,
  } = props;

  useEffect(() => {
    return () => {
      clear_checklist_flag.current = {};
    };
  }, []);
  const unionCheckList = systemsCheckListData?.union_check_list;
  const [loading, setLoading] = useState(false);
  const clear_checklist_flag = useRef({
    original: systemsCheckListData ? JSON.parse(JSON.stringify(systemsCheckListData.data)) : {},
    indexs: [],
  });

  const setValueHandler = (rowIdx, colIdx, value) => {
    clear_checklist_flag.current.indexs.push({ rowIdx, colIdx });
    const systemChecklistSection = { ...systemsCheckListData };
    systemChecklistSection.data[rowIdx].values[colIdx].value = value;
    const selectedValue = systemChecklistSection.data[rowIdx].values[colIdx].value;
    if (colIdx === 0 && selectedValue && selectedValue !== PROPER) {
      // if first colum is not proper and row has show stopper set show stopper NON_CRIRTICAL_FAULT_SHOW_STOPPER = 'תקלה לא קריטית: לתקן בהקדם'
      systemChecklistSection.data[rowIdx].show_stopper = NON_CRIRTICAL_FAULT_SHOW_STOPPER;
    } else if (colIdx === 1) {
      // for second input after good  / not good
      const options = systemChecklistSection.data[rowIdx].values[colIdx].options;
      if (typeof selectedValue === 'string') {
        const { action: actionValue, showStopper } = findShowStopperAndAction(
          options,
          selectedValue,
        );
        // set recommended action for next column
        systemChecklistSection.data[rowIdx].values[colIdx + 1].value = actionValue;
        // set show stopper text for row
        systemChecklistSection.data[rowIdx].show_stopper = showStopper;
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
    uploadPhoto(formData).then(({ result }) => {
      prepareImage(rowIdx, colIdx, true, result);
    });
    prepareImage(rowIdx, colIdx, false, element.files[0]);
  };

  const prepareImage = (rowIdx, colIdx, is_api_response, photo_url) => {
    const systemChecklistSection = { ...systemsCheckListData };
    if (!is_api_response) {
      let reader = new FileReader();
      let file = photo_url;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        systemChecklistSection.data[rowIdx].values[colIdx].value.push(reader.result);
        updateProcessPopupStateHandler({ systemChecklistSection });
      };
    } else {
      systemChecklistSection.data[rowIdx].values[colIdx].value.pop();
      photo_url === undefined &&
        (systemChecklistSection.data[rowIdx]['message'] = IMAGE_UPLOAD_ERROR_MESSAGE);
      photo_url &&
        systemChecklistSection.data[rowIdx].values[colIdx].value.push(`${API}${photo_url}`);
      updateProcessPopupStateHandler({ systemChecklistSection });
    }
  };

  const updateSystemsUnionRowStatus = (unionTests, rowTitle) => {
    // calculate test result according to union tests
    const testsStatus = CheckListService.calculateTestsStatus(unionTests);
    //find and update in check list value
    const checkListCopy = { ...systemsCheckListData };
    const test = checkListCopy.data.find((i) => i.row_title === rowTitle);
    test.values[0].value = testsStatus;
    updateProcessPopupStateHandler({ ' systemChecklistSection': checkListCopy });
  };

  const updateCheckListDataHandler = async () => {
    if (!unionCheckList) {
      setLoading((prev) => !prev);
      let responce = await updateActualSystemCheckListSectionMobile(systemsCheckListData);
      const checkList = responce?.result;
      // change edited check list in local storage and set new systems list (currentSystems) in UpdateProccessPopup
      const systemsList = editCheckListHandler(layer, selectedSystemId, checkList);
      updateProcessPopupStateHandler({ systemLayers: systemsList });
      setLoading((prev) => !prev);
      setSystemsChecklistViewable();
    } else if (unionCheckList) {
      setLoading((prev) => !prev);
      const { data: tests, row_title, order_id, actual_system_id } = systemsCheckListData;
      let responce = await updateUnionChecklist(tests, order_id, actual_system_id, row_title);
      const systemsList = responce?.result;

      updateUnionSystemsGoodNotGoodStatus(tests, row_title);
      updateSystemsListHandler({ systemLayers: systemsList });
      setLoading((prev) => !prev);
      setSystemsChecklistViewable();
    }
  };

  const setAllTestsStatusOk = (e) => {
    const systemChecklistSection = { ...systemsCheckListData };
    systemChecklistSection.data.forEach((i) => (i.values[0].value = PROPER));
    updateProcessPopupStateHandler({ systemChecklistSection });
    // updateCheckListDataHandler()
  };

  const clearCurrentDataAndClose = () => {
    const systemChecklistSection = { ...systemsCheckListData };
    clear_checklist_flag.current.indexs.map((item) => {
      let val = clear_checklist_flag.current.original[item.rowIdx].values[item.colIdx].value;
      if (Array.isArray(val)) {
        systemChecklistSection.data[item.rowIdx].values[item.colIdx + 1].value =
          clear_checklist_flag.current.original[item.rowIdx].values[item.colIdx + 1].value;
      }
      systemChecklistSection.data[item.rowIdx].values[item.colIdx].value = val;
    });
    setSystemsChecklistViewable();
  };

  return systemsCheckListData ? (
    <DialogPopup
      title={title}
      handleClose={() => {
        updateCheckListDataHandler();
      }}
      content={
        <TableContainer component={Paper} className={classes.container}>
          {systemsCheckListData && systemsCheckListData.data && (
            <Table stickyHeader>
              <SystemsCheckListSectionTableHead />
              <SystemsCheckListSectionTableBody
                systemsCheckListData={systemsCheckListData}
                setValueHandler={setValueHandler}
                uploadPhotoHandler={uploadPhotoHandler}
                removeFileHandler={removeFileHandler}
                updateProcessPopupStateHandler={updateProcessPopupStateHandler}
                updateUnionSystemsGoodNotGoodStatus={updateSystemsUnionRowStatus}
              />
            </Table>
          )}
        </TableContainer>
      }
      actions={
        <CheckListActions
          okHandler={updateCheckListDataHandler}
          cancelHandler={clearCurrentDataAndClose}
          allRightHandler={setAllTestsStatusOk}
          loading={loading}
        />
      }
    />
  ) : null;
}

const CheckListActions = (props) => {
  const windowWidth = useSelector((state) => state.pageInfo.width);
  const buttonWidth = calculateButtonWidth(windowWidth);
  const classes = useStyles();
  const { okHandler, cancelHandler, allRightHandler, loading = false } = props;
  return (
    <Grid className={classes.actionsWrapper} style={{ width: '100%' }}>
      <CustomizedButton
        backgroundColor={BLUE_COLOR}
        textColor={WHITE_COLOR}
        text={SAVE}
        clickHandler={okHandler}
        width={buttonWidth}
        loading={loading}
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
        text={ALL_RIGHT}
        clickHandler={allRightHandler}
        width={buttonWidth}
        loading={false}
      />
    </Grid>
  );
};

export default SystemsCheckListSection;
