import React from 'react';
import DialogPopup from '../../../../../../reused-components/DialogPopup/dialogPopup';
import { Table, TableContainer, Paper } from '@material-ui/core';
import { useStyles } from '../../styles';
import { CheckListService } from '../../services';
import TestsPerFloorActions from './parts/actions';
import TestsPerFloorTableBody from './parts/body';
import TestsPerFloorTableHead from './parts/head';
const YES_NO_COLUMN_INDEX = 0;

const TestsPerFloorPopup = (props) => {
  const {
    tests,
    setTestsPerFloor,
    selectedRowIdx,
    setCheckListValue,
    addRow,
    deleteRow,
    title,
  } = props;
  const { table_head, data } = tests;
  const classes = useStyles();

  const submitHandler = async () => {
    const result = await CheckListService.submitTests(tests);
    // if result ok set selected test first colum goo else set first column not good
    setCheckListValue(selectedRowIdx, YES_NO_COLUMN_INDEX, result);
    // cllose popup
    setTestsPerFloor('');
  };

  return props ? (
    <DialogPopup
      handleClose={() => setTestsPerFloor('')}
      width={'75%'}
      height={'100%'}
      isOpen={!!tests}
      handleCancel={() => setTestsPerFloor('')}
      title={title}
      actions={<TestsPerFloorActions saveHandler={submitHandler} addTestHandler={addRow} />}
      content={
        <TableContainer component={Paper} classes={{ root: classes.MuiTableContainer }}>
          <Table stickyHeader>
            <TestsPerFloorTableHead data={table_head} />
            <TestsPerFloorTableBody
              data={data}
              deleteRow={deleteRow}
              tests={tests}
              setTestsPerFloor={setTestsPerFloor}
            />
          </Table>
        </TableContainer>
      }
    />
  ) : null;
};

export default TestsPerFloorPopup;
