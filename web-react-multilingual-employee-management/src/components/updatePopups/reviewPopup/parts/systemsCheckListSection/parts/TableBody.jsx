import React, { useEffect } from 'react';
import TableBody from '@material-ui/core/TableBody';
import SystemsCheckListSection from '../SystemsCheckListSection';
import { useAdditionalCheckList } from '../../../../../../hooks/useAdditionalCheckLists';
import { useTestsPerFloor } from '../../../../../../hooks/useTestsPerFloor';
import CheckListRow from './checkListRow';
import TestsPerFloorPopup from './testsPerFloor/testsPerFloorPopup';

const SystemsCheckListSectionTableBody = ({
  systemsCheckListData,
  setValueHandler,
  uploadPhotoHandler,
  removeFileHandler,
  updateProcessPopupStateHandler,
  updateUnionSystemsGoodNotGoodStatus,
}) => {
  const { order_id, actual_system_id, union_check_list } = systemsCheckListData;
  const {
    setRowTitle,
    unionTest,
    setUnionTest,
    rowTitle,
    updateUnionTestHandler,
  } = useAdditionalCheckList(order_id, actual_system_id, union_check_list);
  const {
    testsPerFloor,
    setTestsPerFloor,
    getTestsPerFloor,
    addRow,
    deleteRow,
    selectedRowIdx,
    selectedRowTitle,
  } = useTestsPerFloor(actual_system_id);

  const closeAdditionalTestPopupHandler = () => {
    setUnionTest('');
    setRowTitle('');
  };

  return (
    <TableBody>
      {systemsCheckListData.data.map((row, rowIdx) => (
        <CheckListRow
          key={row._id}
          row={row}
          rowIdx={rowIdx}
          setValueHandler={setValueHandler}
          uploadPhotoHandler={uploadPhotoHandler}
          removeFileHandler={removeFileHandler}
          orderId={order_id}
          setRowTitle={setRowTitle}
          getTestsPerFloor={getTestsPerFloor}
        />
      ))}
      {unionTest ? (
        <SystemsCheckListSection
          systemsCheckListData={unionTest}
          updateSystemsListHandler={updateProcessPopupStateHandler}
          updateProcessPopupStateHandler={updateUnionTestHandler}
          setSystemsChecklistViewable={closeAdditionalTestPopupHandler}
          updateUnionSystemsGoodNotGoodStatus={updateUnionSystemsGoodNotGoodStatus}
          title={rowTitle}
        />
      ) : null}
      {testsPerFloor ? (
        <TestsPerFloorPopup
          tests={testsPerFloor}
          setTestsPerFloor={setTestsPerFloor}
          selectedRowIdx={selectedRowIdx}
          setCheckListValue={setValueHandler}
          addRow={addRow}
          deleteRow={deleteRow}
          title={selectedRowTitle}
        />
      ) : null}
    </TableBody>
  );
};

export default SystemsCheckListSectionTableBody;
