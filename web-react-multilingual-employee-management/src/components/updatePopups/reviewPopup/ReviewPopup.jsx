import React, { useState, useEffect } from 'react';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup.jsx';
import AddButton from './reusableComponents/addButton.jsx';
import TopNav from './parts/content/topNav.jsx';
import NavMenu from './parts/content/navMenu.jsx';
import { Grid } from '@material-ui/core';
import Timer from './parts/actions/timer.jsx';
import { useOnline } from '../../../hooks/useOnline.js';
import { useTasks } from '../../../hooks/useTasks.js';
import { useFiles } from '../../../hooks/useFiles.js';
import ButtonsGroup from './parts/actions/dialogPopUpButtons.jsx';
import TasksList from './parts/tasks/tasksList.jsx';
import Files from './parts/files/files.jsx';
import Systems from './parts/systems/systems.jsx';
import SystemsCheckListSection from './parts/systemsCheckListSection/SystemsCheckListSection.jsx';
import CreateSystemPopup from './parts/createSystemPopup/CreateSystemPopup.jsx';
import { TIMERS, SYSTEMS_TAB } from '../../../constants/review-popup.js';
import { useStyles } from './style.js';
import { getTimers } from '../../../functions/helpers/reviewPopupTimer.js';
import { REVIEW_POPUP_TIMER } from '../../../constants/offline-mode.js';
import { useRef } from 'react';
import Loader from '../../LoaderNew/Loader.js';
import { useDispatch, useSelector } from 'react-redux';
import ReservationPopup from '../../Header/Parts/ReservationPopup/ReservationPopup.jsx';
import { showOrderPopup } from '../../../actions/mainPopup_actions.js';
import ErrorPopup from '../../NavBar/ErrorPopup/ErrorPopup.jsx';
import moment from 'moment';

const ReviewPopup = (props) => {
  const {
    systemsProps,
    orderTasksProps,
    techniciansProps,
    selectedProcess,
    closeHandler,
    openReservationPopupHandler,
    submitForm,
    createTaskHandler,
    customerId,
    isCheckListShown,
    checkListProps,
    actualDuration,
    processStartTime,
    resourcesQuntity,
    loading,
    openFrom,
    setSystemDurationData,
  } = props;

  const dispatch = useDispatch();
  const classes = useStyles();
  const duration_ref = useRef({ duration: actualDuration, process: selectedProcess });
  const { currentOrderId: orderId, systemLayers, updateProcessPopupStateHandler } = systemsProps;
  const orderProcessId = selectedProcess?.proccess?._id;
  // const actualDuration = selectedProcess?.proccess?.actual_duration || 0
  const onlineStatus = useOnline();
  const [tasks, setTasks] = useTasks(orderProcessId);
  const [files, setFiles] = useFiles(customerId);
  const [confirmationPopUpOpen, setConfirmationPopUpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(SYSTEMS_TAB);
  const [createSystemPopupShown, setCreateSystemPopupShown] = useState(false);
  const [systemsActive, setSystemsActive] = useState(false);
  const [selectedProcessState, setSelectedProcessState] = useState(selectedProcess);

  const [startTime, setStartTime] = useState(getTimers()[orderProcessId] || '');
  const show_order_popup = useSelector((state) => state.mainPopup.show_order_popup);
  const history = useSelector((state) => state.router);

  const [showErrorPopup, setShowErrorPopup] = useState({
    show_error_popup: false,
    error_text: null,
  });

  useEffect(() => {
    const timers = localStorage.getItem(TIMERS);
    if (timers) {
      const timersObject = JSON.parse(timers);
      const active = !!timersObject[orderProcessId];
      setSystemsActive(active);
    }
    openFrom && setSystemsActive(true);
  }, []);

  (() => {
    let review_timer = JSON.parse(localStorage.getItem(REVIEW_POPUP_TIMER));
    if (review_timer) {
      let duration = review_timer[orderProcessId];
      Number(duration) - Number(duration_ref.current.duration) >= 1 &&
        (duration_ref.current = {
          duration: duration,
          process: {
            ...selectedProcess,
            proccess: {
              ...selectedProcess.proccess,
              initial_duration: duration,
              actual_duration: duration,
            },
          },
        });
    }
  })();

  const closeConfirmationPopupHandler = () => {
    return onlineStatus ? closeHandler() : setConfirmationPopUpOpen(true);
  };

  const togglePopup = (boolean) => {
    dispatch(showOrderPopup(boolean));
  };

  const updateErrorPopup = (boolean, error_text, isUpdateCall = false) => {
    setShowErrorPopup({
      show_error_popup: boolean,
      error_text: error_text,
    });
    //automaticly scroll to top on daily view after adding new order
    if (history?.location?.pathname?.includes?.(`/yearly`)) {
      const calendar = document.getElementById('calender_container');
      if (calendar) {
        !isUpdateCall && calendar.scrollTo(0, 0);
      }
    }
  };

  const getStartTime = (startTime) => {
    if (parseInt(startTime)) {
      return startTime.toString().includes(':')
        ? startTime
        : moment.unix(parseInt(startTime) / 1000).format('HH:mm');
    }
  };

  let duration_time = duration_ref.current.duration;
  let process = duration_ref.current.process;
  return (
    <DialogPopup
      title={selectedProcess?.proccess?.process_name}
      handleClose={closeConfirmationPopupHandler}
      content={
        <React.Fragment>
          <NavMenu
            TopNav={
              <TopNav
                selectedProcess={process || selectedProcess}
                openReservationPopupHandler={openReservationPopupHandler}
                techniciansProps={techniciansProps}
                actualDuration={duration_time}
                startTime={getStartTime(processStartTime)}
                resourcesQuntity={resourcesQuntity}
              />
            }
            setActiveTab={setActiveTab}
            SystemsPage={
              systemLayers ? (
                <Systems {...systemsProps} systemsActive={openFrom || systemsActive} />
              ) : (
                <Loader />
              )
            }
            TasksPage={<TasksList {...orderTasksProps} tasks={tasks} setTasks={setTasks} />}
            FilesPage={<Files files={files} setFiles={setFiles} customerId={customerId} />}
            filesQuantity={files?.length || 0}
            tasksQuantity={tasks?.length || 0}
            systemLayers={systemLayers}
          />
          {isCheckListShown && <SystemsCheckListSection {...checkListProps} />}
        </React.Fragment>
      }
      actions={
        <Grid className={classes.buttonsWrapper}>
          <AddButton
            activeTab={activeTab}
            addTaskHandler={createTaskHandler}
            files={files}
            setFiles={setFiles}
            customerId={customerId}
            addSystemHandler={() =>
              systemsActive ? setCreateSystemPopupShown((state) => !state) : {}
            }
          />
          <ButtonsGroup
            closeHandler={closeHandler}
            submitForm={submitForm}
            confirmationPopUpOpen={confirmationPopUpOpen}
            setConfirmationPopUpOpen={setConfirmationPopUpOpen}
            closePopupHandler={closeConfirmationPopupHandler}
            updateProcessPopupStateHandler={updateProcessPopupStateHandler}
            selectedProcess={selectedProcessState}
            startTime={startTime}
            setStartTime={setStartTime}
            loading={loading}
          />
          <Timer
            setSystemsActive={setSystemsActive}
            systemsActive={systemsActive}
            updateProcessPopupStateHandler={updateProcessPopupStateHandler}
            selectedProcess={process}
            startTime={startTime}
            setStartTime={setStartTime}
            setSystemDurationData={setSystemDurationData}
            openFrom={openFrom}
          />
          {createSystemPopupShown && (
            <CreateSystemPopup
              customer_id={customerId}
              order_id={orderId}
              updateProcessPopupStateHandler={updateProcessPopupStateHandler}
              isOpen={createSystemPopupShown}
              handleClose={() => setCreateSystemPopupShown(false)}
            />
          )}
          {show_order_popup && (
            <div style={{ zIndex: 9999 }}>
              <ReservationPopup
                closePopup={() => {
                  togglePopup(false);
                }}
                updateErrorPopup={updateErrorPopup}
              />
            </div>
          )}
          {showErrorPopup.show_error_popup && (
            <ErrorPopup
              afterConfirmationError={showErrorPopup.error_text}
              updatePopup={(val) => setShowErrorPopup({ ...showErrorPopup, show_error_popup: val })}
            />
          )}
        </Grid>
      }
    />
  );
};

export default ReviewPopup;
