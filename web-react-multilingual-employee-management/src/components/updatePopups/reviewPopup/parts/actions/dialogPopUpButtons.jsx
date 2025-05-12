import React from 'react';
import { Grid } from '@material-ui/core';
import CustomizedButton from '../../reusableComponents/customizedButton';
import {
  TERMINATION_REPORTED,
  SAVE_AND_CLOSE_REVIEW_POP_UP,
  REOPEN_ORDER,
} from '../../../../../constants/translations/review-popup';
import {
  CLOSE_BUTTON_BACKGROUND,
  LIGHT_BLUE,
  WHITE_COLOR,
  BLUE_COLOR,
  BUTTON_WIDTH,
  TIMERS,
} from '../../../../../constants/review-popup';
import DeleteConfirmationPopUp from '../../../../reused-components/DeleteConfirmationPopUp';
import {
  getTimers,
  calculateActualDuration,
  msToTime,
} from '../../../../../functions/helpers/reviewPopupTimer';
import { updateActualDuration } from '../../../../../functions/api/order-process';
import _ from 'lodash';
import { useEffect, useState } from 'react';

const ButtonsGroup = (props) => {
  const {
    closeHandler,
    submitForm,
    setConfirmationPopUpOpen,
    confirmationPopUpOpen,
    closePopupHandler,
    selectedProcess,
    updateProcessPopupStateHandler,
    startTime,
    setStartTime,
    loading,
  } = props;

  const [cancel_loading, setCancelLoading] = useState(false);

  //  useEffect(() => {
  //   return () => setCancelLoading(false)
  //  },[])

  const {
    done: processDone,
    _id: orderProcessId,
    actual_duration: actualDuration,
  } = selectedProcess.proccess;
  const stopTimerHandler = async () => {
    const diff = calculateActualDuration(startTime);
    const body = {
      order_process_id: orderProcessId,
      // increased actual duration
      actual_duration: +actualDuration + diff + '',
    };
    await updateActualDuration(body);
    // save duration into order process info
    updateProcessPopupStateHandler({ actual_duration: msToTime(diff) });
    const timers = getTimers();
    delete timers[orderProcessId];
    localStorage.setItem(TIMERS, JSON.stringify(timers));
    setStartTime('');
    // setSystemsActive(false)
  };

  const submitAndChangeProcessDoneStatus = async (e) => {
    e.stopPropagation();
    setCancelLoading(true);
    const NOT_DONE_QUNTITY = 0;
    const quantity = processDone ? NOT_DONE_QUNTITY : selectedProcess.proccess.quantity;
    const finished = selectedProcess.proccess.finished;
    if (processDone) {
      // update only state for done processes to set process undone to allow work with timer
      const selectedProcessCopy = { ...selectedProcess };
      selectedProcessCopy.proccess.finished = quantity;
      selectedProcessCopy.proccess.done = finished === quantity;
      updateProcessPopupStateHandler({ selectedProcess, finished: quantity }, () =>
        submitForm(() => setCancelLoading(false), true),
      );
    } else {
      stopTimerHandler();
      updateProcessPopupStateHandler({ finished: quantity }, () =>
        submitForm(() => setCancelLoading(false)),
      );
    }
  };

  const createSubmitButtonText = () => {
    const text = processDone ? REOPEN_ORDER : TERMINATION_REPORTED;
    return text;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    submitForm(undefined, true);
  };

  return (
    <React.Fragment>
      <Grid style={{ display: 'flex' }}>
        <CustomizedButton
          backgroundColor={CLOSE_BUTTON_BACKGROUND}
          textColor={WHITE_COLOR}
          text={SAVE_AND_CLOSE_REVIEW_POP_UP}
          clickHandler={handleClick}
          width={BUTTON_WIDTH}
          loading={loading}
        />
        <CustomizedButton
          backgroundColor={LIGHT_BLUE}
          textColor={BLUE_COLOR}
          text={createSubmitButtonText()}
          clickHandler={submitAndChangeProcessDoneStatus}
          width={BUTTON_WIDTH}
          loading={cancel_loading}
        />
      </Grid>
      <DeleteConfirmationPopUp
        okCallback={handleClick}
        cancelCallback={() => setConfirmationPopUpOpen(false)}
        isOpen={confirmationPopUpOpen}
      />
    </React.Fragment>
  );
};

export default ButtonsGroup;
