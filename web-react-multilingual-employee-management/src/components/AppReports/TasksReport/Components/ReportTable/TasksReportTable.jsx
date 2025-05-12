import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TasksTableHead from './parts/TasksTableHead';
import TasksReportTableRow from './parts/TasksReportTableRow';
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import { useStyles, jss, theme } from './styles';
import { makeStyles } from '@material-ui/core';
import UpdateProccessPopup from '../../../../updatePopups/UpdateProccessPopup';
import moment from 'moment';
import { getReportProcessDataPopup } from '../../../../../functions/api/popup';
import { setEndDateForProcess } from '../../../../../functions/api/orders';

const useTableRowStyles = makeStyles(() => ({
  rowCSS: {
    cursor: 'pointer',
    '&:hover': {
      background: '#f1f1f1',
    },
  },
}));

const TasksReportTable = (props) => {
  const {
    tasksReport,
    sortDirection,
    changeSortDirection,
    setLastDeletedTaskId,
    updateReportGrid,
  } = props;
  const classes = useStyles();
  const classesTableRow = useTableRowStyles();
  const [updateProcessPopup, setUpdateProcessPopup] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState({});
  const [loggedInData, setLoggedInData] = useState(null);
  const [prevSelectedRow, setPrevSelectedRow] = useState(null);

  const initProccessUpdatePopup = async (data) => {
    await getReportProcessDataPopup(data.order_id, data.process_id)
      .then((response) => {
        if (response.ok) {
          if (response.result._id) {
            let gotProcess = {
              proccess: {
                ...response.result,
                process_name: response.result.process_detail.name,
              },
              client_name: response.result.order_detail.client_name,
              order_number: response.result.order_detail.order_number,
            };
            //opening process popup
            setSelectedProcess(gotProcess);
            setUpdateProcessPopup(true);
            setPrevSelectedRow(data.rowId);
            document.getElementById(data.rowId).style.background = '#f1f1f1';
          }
        } else {
          console.log('error response: ', response);
        }
        setUpdateProcessPopup(true);
      })
      .catch((error) => {
        console.error();
      });
  };

  const closeUpdateMenu = () => {
    document.getElementById(prevSelectedRow).style.background = '';
    setUpdateProcessPopup(false);
    setSelectedProcess({});
  };

  const submitUpdatesFromPopup = async (body, constant, refetchData, newProcess = null) => {
    let newBody = {
      _id: body._id,
      date: body.endDate,
      view: body.view,
      from: body.from,
      to: body.to,
      order_employee_id: null,
      department_id: loggedInData.selectedDepartment._id,
    };
    //if date didnt change dont reposition
    if (moment(body.date).isSame(moment(body.process.process_date))) {
      if (newBody.date) {
        await setEndDateForProcess(newBody);
      }
    }
    closeUpdateMenu();
  };

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <TableContainer className={classes.container}>
          <Table stickyHeader>
            <TasksTableHead
              sortDirection={sortDirection}
              changeSortDirection={changeSortDirection}
            />
            <TableBody>
              {tasksReport.map((i) => (
                <TasksReportTableRow
                  classesTableRow={classesTableRow}
                  key={i.task_id}
                  task={i}
                  setLastDeletedTaskId={setLastDeletedTaskId}
                  initProccessUpdatePopup={initProccessUpdatePopup}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {updateProcessPopup ? (
          <UpdateProccessPopup
            selectedProcess={selectedProcess}
            closeUpdateMenu={closeUpdateMenu}
            submitUpdatesFromPopup={submitUpdatesFromPopup}
            setLoggedInData={setLoggedInData}
          />
        ) : null}
      </ThemeProvider>
    </StylesProvider>
  );
};

export default TasksReportTable;
