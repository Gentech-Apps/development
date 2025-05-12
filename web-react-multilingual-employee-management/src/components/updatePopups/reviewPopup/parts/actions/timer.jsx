import React from 'react';
import ActivateTimerButton from '../../reusableComponents/activateTimerButton';
import ActiveTimerButton from '../../reusableComponents/activeTimerButton';
import { TIMERS } from '../../../../../constants/review-popup';
import {
  updateActualDuration,
  setProcessStartTime,
} from '../../../../../functions/api/order-process';
import { msToTime } from '../../../../../functions/helpers/reviewPopupTimer';
import {
  getTimers,
  calculateActualDuration,
} from '../../../../../functions/helpers/reviewPopupTimer';
import moment from 'moment';
import { REVIEW_POPUP_TIMER } from '../../../../../constants/offline-mode';

const Timer = (props) => {
  const {
    setSystemsActive,
    systemsActive,
    updateProcessPopupStateHandler,
    selectedProcess,
    startTime,
    setStartTime,
    openFrom,
    setSystemDurationData,
  } = props;
  const view = openFrom ? 'none' : '';

  const { _id: orderProcessId, done } = selectedProcess.proccess;

  const startTimerHandler = () => {
    const { start_time, _id: selectedProcessId } = selectedProcess?.proccess;
    // add new date if start time doesn't exist
    if (!start_time) {
      const startTime = Date.now() + '';
      const selectedProcessCopy = { ...selectedProcess };
      selectedProcessCopy.proccess.start_time = startTime;
      setProcessStartTime(selectedProcessId, startTime);
      updateProcessPopupStateHandler({ selectedProcess: selectedProcessCopy });
    }

    const now = Date.now();
    const timers = getTimers();
    timers[orderProcessId] = now;
    localStorage.setItem(TIMERS, JSON.stringify(timers));
    setStartTime(now);
    setSystemsActive(true);
  };

  const stopTimerHandler = async (startTime) => {
    const actualDuration = selectedProcess?.proccess?.actual_duration || 0;
    const diff = calculateActualDuration(startTime);
    const body = {
      order_process_id: orderProcessId,
      // increased actual duration
      actual_duration: +actualDuration + diff + '',
    };
    let result = await updateActualDuration(body);
    setSystemDurationData({ duration: result.initial_duration, start_time: result.start_time });
    let review_timer = JSON.parse(localStorage.getItem(REVIEW_POPUP_TIMER));
    localStorage.setItem(
      REVIEW_POPUP_TIMER,
      JSON.stringify({ ...review_timer, [result._id]: result.initial_duration }),
    );
    // save duration into order process info
    updateProcessPopupStateHandler({ actual_duration: msToTime(diff) });
    const timers = getTimers();
    delete timers[orderProcessId];
    localStorage.setItem(TIMERS, JSON.stringify(timers));
    setStartTime('');
    setSystemsActive(false);
  };

  return startTime && systemsActive ? (
    <ActiveTimerButton
      clickHandler={() => stopTimerHandler(startTime)}
      startTime={startTime}
      view={openFrom}
    />
  ) : (
    <ActivateTimerButton clickHandler={done ? () => null : startTimerHandler} view={view} />
  );
};

export default Timer;
