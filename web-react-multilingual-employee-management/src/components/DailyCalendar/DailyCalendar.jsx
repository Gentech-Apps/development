import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Grid } from '@material-ui/core';
import Stripe from '../reused-components/Stripe';
import { generalGetRequest } from '../../functions/api/general';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import UpdateProccessPopup from '../updatePopups/UpdateProccessPopup';
import Loader from '../LoaderNew/Loader';
import _ from 'lodash';
import { upateOrders } from '../../functions/api/orders';
import UpdateProccessPopupContext from './UpdateProcessPopupContext';
import DailyCalendarTools from './tools';
import Calendar from './Calendar/Calendar';
import { useStyles } from './style';
import { useAnnualViewScroll } from '../../hooks/useAnnualViewScroll';
import { setRouteLocation } from '../../actions/route_action';

const DailyCalendar = (props) => {
  const classes = useStyles();
  const scrollable = useRef(null);
  useAnnualViewScroll(scrollable);
  const [daysWithProcesses, setDaysWithProcesses] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('');
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const startDate = useRef(DailyCalendarTools.createInitialDate());
  const selectedUser = useSelector((state) => state.login.selectedUser);
  const selectedDepartment = useSelector((state) => state.login.selectedDepartment._id);
  const holidays = useSelector((state) => state.login.user.holidays);
  const offDays = useSelector((state) => state.login.user.off_days);
  const [loader, setLoader] = useState(false);
  const orderNumber = useSelector((state) => state.monthResource.orderNumber);
  const dispatch = useDispatch();

  const setSelectedProcessHandler = useCallback((day) => {
    const dayCopy = _.cloneDeep(day);
    setSelectedProcess(dayCopy);
  }, []);

  const submitUpdatesFromPopup = async (body) => {
    // ******************process reposition **********************
    // compare dates
    const newDate = body.date;
    const previousDate = body.process.process_date;
    const isSameDate = moment(newDate).isSame(previousDate, 'day');
    // if date was changed ----> update process date
    if (!isSameDate) {
      // const res = await getWarnings(body)
      await upateOrders(body);
    }
    // ***********************************************************************
    // update processes
    const processDate = DailyCalendarTools.formatDate(selectedProcess.proccess.process_date);
    const endDate = isSameDate ? processDate : DailyCalendarTools.formatDate(newDate);
    setSelectedProcess('');
    setLoader(true);
    // await DailyCalendarTools.updateProcessDate()
    const res = await generalGetRequest(
      `/system/order/vertical-daily-view?start_date=${processDate}&end_date=${endDate}&user_id=${selectedUser}&department_id=${selectedDepartment}`,
    );
    const updatedDays = res?.result;
    if (updatedDays?.length) {
      const daysWithProcessesCopy = [...daysWithProcesses];
      const updateIndex = daysWithProcessesCopy.findIndex((i) =>
        moment(i.date).isSame(processDate, 'day'),
      );
      const daysChanged = updatedDays.length;
      daysWithProcessesCopy.splice(updateIndex, daysChanged, ...updatedDays);
      setDaysWithProcesses(daysWithProcessesCopy);
    }
    setLoader(false);
  };

  useEffect(() => {
    let pathname = window.location.pathname;
    dispatch(setRouteLocation(pathname));
    const getData = async () => {
      // on filters change set new start date
      startDate.current = DailyCalendarTools.createInitialDate();
      setLoader(true);
      // if department or user changed set start date === new Date
      const responce = await getOrderProcesses();
      if (responce.result) {
        setDaysWithProcesses(responce.result);
      }

      setLoader(false);
    };
    getData();
  }, [selectedUser, selectedDepartment, orderNumber]);

  useEffect(() => {
    const loadMore = async () => {
      setLoader(true);
      const responce = await getOrderProcesses();
      if (responce.ok) {
        setHasMoreItems(false);
        setDaysWithProcesses((a) => [...a, ...responce.result]);
      }
      setLoader(false);
    };
    hasMoreItems && loadMore();
  }, [hasMoreItems]);

  const getOrderProcesses = async () => {
    const isFiltered = !!(selectedUser || selectedDepartment);
    const endDate = DailyCalendarTools.createEndDate(startDate.current, isFiltered);
    let urlOrderNumber = window.location.search.replace('?order_number=', '');
    const responce = await generalGetRequest(
      `/system/order/vertical-daily-view?start_date=${startDate.current}&end_date=${endDate}&user_id=${selectedUser}&department_id=${selectedDepartment}&order_number=${urlOrderNumber}`,
    );
    startDate.current = DailyCalendarTools.createNewStartDate(endDate);
    return responce;
  };

  const onDragEnd = useCallback(
    async (result) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      const sourceDroppableId = source.droppableId;
      const destinationDroppableId = destination.droppableId;

      const { user_id: sourceUserId, date: sourceDate } = DailyCalendarTools.parseId(
        sourceDroppableId,
      );
      const {
        user_id: destinationUserId,
        date: destinationDate,
        sub_departments: subDepartments,
      } = DailyCalendarTools.parseId(destinationDroppableId);
      const {
        process_id: orderProcessId,
        user_id: deleteUserId,
        sub_department_id: subDepartmentId,
      } = DailyCalendarTools.parseId(draggableId);

      const userAndProcessFromTheSameDepartment = subDepartments.includes(subDepartmentId);
      // not allow d&d for another day of for user that doesn't belong to process department
      if (
        DailyCalendarTools.checkSameDay(sourceDate, destinationDate) ||
        !userAndProcessFromTheSameDepartment
      )
        return;

      setLoader(true);
      const urlOrderNumber = window.location.search.replace('?order_number=', '');
      const res = await generalGetRequest(
        `/system/order-process/daily-view-drag-and-drop?start_date=${sourceDate}&end_date=${destinationDate}&source_user_id=${sourceUserId}&department_id=${selectedDepartment}&order_process_id=${orderProcessId}&user_move_to=${destinationUserId}&user_id=${selectedUser}&order_number=${urlOrderNumber}`,
      );
      const updatedDays = res?.result;
      if (updatedDays) {
        const daysWithProcessesCopy = [...daysWithProcesses];
        updatedDays.forEach((updatedDay) => {
          const { date } = updatedDay;
          const updateIndex = daysWithProcessesCopy.findIndex((i) =>
            moment(i.date).isSame(date, 'day'),
          );
          daysWithProcessesCopy.splice(updateIndex, 1, updatedDay);
        });
        setDaysWithProcesses(daysWithProcessesCopy);
      }

      setLoader(false);
    },
    [daysWithProcesses],
  );

  return (
    <UpdateProccessPopupContext.Provider value={{ setSelectedProcessHandler }}>
      <Stripe/>
      <Grid className={classes.calendarHolder}>
        {daysWithProcesses ? (
          <Grid classes={{ root: classes.dailyProcessesWrapper }} ref={scrollable}>
            <Calendar
              parentElement={scrollable}
              daysWithProcesses={daysWithProcesses}
              setHasMoreItems={setHasMoreItems}
              hasMoreItems={hasMoreItems}
              onDragEnd={onDragEnd}
            />
          </Grid>
        ) : (
          <Loader />
        )}
        {
          // add loader on processes uploading
          loader ? <Loader /> : null
        }
      </Grid>
      {selectedProcess ? (
        <UpdateProccessPopup
          selectedProcess={selectedProcess}
          closeUpdateMenu={() => setSelectedProcess('')}
          submitUpdatesFromPopup={submitUpdatesFromPopup}
          offDays={offDays}
          holidays={holidays}
        />
      ) : null}
    </UpdateProccessPopupContext.Provider>
  );
};

export default DailyCalendar;
