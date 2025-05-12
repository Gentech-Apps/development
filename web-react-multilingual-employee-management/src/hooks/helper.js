import * as momentBusinessDays from 'moment-business-days';
import { SERVICE } from '../constants';
import moment from 'moment';
import { ACTIVE_TIME_STAMP, REFRESH_TIME } from '../constants/offline-mode';

let uniqId = require('uniqid');

export const closePopupOnBackButton = (popup, callBack) => {
  if (popup) {
    callBack(true);
  } else {
    callBack(false);
  }
};
export const createPopupUrl = (history) => {
  let isVerified =
    ['customers-page', 'daily-vertical-processes', 'yearly', 'backlogs'].filter((item) =>
      window.location.pathname.includes(item),
    ).length === 0;
  let isExist = window.location.pathname.includes('p8zi');
  let search = window.location.search;
  isVerified && !isExist && history.push(window.location.pathname + `/p8zi${uniqId()}${search}`);
};

export const removePopupUrl = (history) => {
  let is_popup_url = window.location.pathname.includes('p8zi');
  is_popup_url && history.goBack();
};

export const calculateEndDateAccordingToDuration = (
  processDate,
  process,
  user,
  original_date = null,
  original_duration = null,
) => {
  const { working_hours: workingHours, type_of_factory: typeOfFactory } = user;
  // Start date and time + Duration + Quantity * order units
  const { duration_days: durationDays, initial_duration: actualDuration } = process;
  // for SERVICE factory we have timer where calculation is in miliseconds, in other factories actual duration is in hours
  if (typeOfFactory !== SERVICE) {
    let date = moment(original_date || processDate)
      .set('hours', 16)
      .toDate();
    let endDate = momentBusinessDays(date, 'DD-MM-YYYY').businessAdd(
      original_duration || durationDays,
    )._d;
    let endDateSelectedTime = moment(endDate).set('hours', 16).toDate();
    return endDateSelectedTime;
  }
};

export const captureTimeStamp = () => {
  let log_time_stamp = JSON.parse(localStorage.getItem(ACTIVE_TIME_STAMP));
  let current_time = new Date().getTime();
  log_time_stamp && current_time - log_time_stamp >= REFRESH_TIME && window.location.reload();
  localStorage.setItem(ACTIVE_TIME_STAMP, current_time);
};

export const HtmlTooltipStyled = () => {
  return {
    backgroundColor: 'white',
    color: '#455768',
    padding: '0px',
    margin: '0px !important',
    width: '222px',
    fontFamily: 'Rubik',
    borderRadius: '6px',
    border: '2px solid #BEBEBE',
  };
};

export const getPosition = (position, date) =>
  new Date(date).getDay() === 0 ? position.initial : position.last;
export const dateMatch = (date) => date.getFullYear() + date.getMonth() + date.getDate();
