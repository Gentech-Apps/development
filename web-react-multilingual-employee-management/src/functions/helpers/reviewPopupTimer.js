import { TIMERS } from '../../constants/review-popup';
export const msToTime = (duration) => {
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  // const formattedHours = (hours < 10) ? (hours > 1) ? "0" + hours : '00' : hours;
  // const formattedMinutes = (minutes < 10) ? (minutes > 1 ) ? "0" + minutes :'00' : minutes;

  // return formattedHours + ":" + formattedMinutes
  const result = hours + minutes > 0 ? hours + 1 : hours;
};

export function getTimers() {
  const timers = localStorage.getItem(TIMERS);
  if (timers) return JSON.parse(timers);
  return {};
}

export const calculateActualDuration = (startTime) => {
  const endTime = Date.now();
  const diff = endTime - startTime;
  return diff;
};
