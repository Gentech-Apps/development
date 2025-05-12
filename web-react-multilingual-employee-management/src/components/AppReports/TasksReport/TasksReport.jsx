import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar/SideBar';
import TasksReportTable from './Components/ReportTable/TasksReportTable';
import { useTasksReport } from '../../../hooks/useTasksReport';
import Loader from '../../LoaderNew/Loader';
import TasksReportFilters from './Components/Filters/TaskReportFilters';
import { SORT_ASC, SORT_DESC } from '../../../constants/tasks-report';
import { useSelector } from 'react-redux';
import { setAutocompleteOptions } from '../../../actions/tasks-report-actions';
import { useDispatch } from 'react-redux';
import moment from 'moment';

const TasksReport = (props) => {
  const queryForAutocomplete = useSelector((state) => state.taskReports.searchQuery);
  const currentSearchRequest = useSelector((state) => state.taskReports.filterTasksQuery);
  const dispatch = useDispatch();
  const [currentResource, setCurrentResource] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState('');
  const [currentOrderNumber, setCurrentOrderNumber] = useState('');
  const [sortDirection, setSortDirection] = useState(SORT_ASC);
  const [lastDeletedTaskId, setLastDeletedTaskId] = useState('');
  const [tasksReport, isLoading] = useTasksReport(
    currentResource,
    currentCustomer,
    currentOrderNumber,
    currentSearchRequest,
    sortDirection,
    lastDeletedTaskId,
  );

  useEffect(() => {
    const createAutocomletionOptions = (data, queryForAutocomplete) => {
      let result = [];
      if (data && queryForAutocomplete) {
        data.map((task) => {
          const {
            customer_name,
            due_date,
            order_number,
            process_name,
            resource,
            task_description,
          } = task;
          result = [
            ...result,
            customer_name,
            moment(due_date).format('DD/MM/YYYY'),
            order_number,
            process_name,
            resource,
            task_description,
          ];
        });
      }

      result = [...new Set(result)];
      const optionsFilter = (query) => (option) =>
        option?.toUpperCase?.()?.includes(query?.toUpperCase());
      const filteredOptions = result
        .filter(optionsFilter(queryForAutocomplete))
        .map((i, idx) => ({ _id: idx, order_number: i }));
      dispatch(setAutocompleteOptions(filteredOptions));
    };
    createAutocomletionOptions(tasksReport, queryForAutocomplete);
  }, [tasksReport, queryForAutocomplete]);

  const changeSortDirectionHandler = () => {
    if (sortDirection === SORT_ASC) {
      setSortDirection(SORT_DESC);
      return;
    }
    setSortDirection(SORT_ASC);
  };

  return (
    <div className="reports__container">
      <SideBar />
      <section className="backlogs-reports__main">
        <TasksReportFilters
          currentResource={currentResource}
          setCurrentResource={setCurrentResource}
          currentCustomer={currentCustomer}
          setCurrentCustomer={setCurrentCustomer}
          currentOrderNumber={currentOrderNumber}
          setCurrentOrderNumber={setCurrentOrderNumber}
          tasksReport={tasksReport}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <TasksReportTable
            tasksReport={tasksReport}
            sortDirection={sortDirection}
            changeSortDirection={changeSortDirectionHandler}
            setLastDeletedTaskId={setLastDeletedTaskId}
          />
        )}
      </section>
    </div>
  );
};

export default TasksReport;
