import React from 'react';
import moment from 'moment';
import uuid from 'uuid';
import { MILISECONDS_PER_HOUR } from '../../constants';
// import Process from './Calendar/Schedule/DailySchedule/Process'
// import Downtime from './Calendar/Schedule/DailySchedule/Downtime'

const START_OF_TIMELINE = 7;
const WEEKS_PAGINATION = 2;
const WEEKS_PAGINATION_FOR_FILTERED = 5;

class MonthyResourceTools {
  // static createScheduleForUser = (processes, isFirstProcess, isLastProcess) => {
  //     // checks processes duration and acoording to it return process block or downtime block
  //     let endHour = START_OF_TIMELINE
  //     // if there are not processes for user return full day downtime
  //     if (!processes.length) {
  //         return ([<Downtime duration={10 * MILISECONDS_PER_HOUR} key={uuid()} isFirstProcess={isFirstProcess} isLastProcess={isLastProcess} />])
  //     }
  //     const schedule = []
  //     processes.forEach((order_process, index) => {
  //         const { proccess: process } = order_process
  //         const { start_time, actual_duration, _id } = process
  //         const START_OF_WORKING_DAY = 8
  //         const processStartTime = this.getDecimalFormattedStartTime(start_time) || (endHour < START_OF_WORKING_DAY ? START_OF_WORKING_DAY : endHour)
  //         const processEndTime = processStartTime + (actual_duration / MILISECONDS_PER_HOUR)
  //         // check downtime and if exist add emty downtime block
  //         const downtime = (processStartTime - endHour) * MILISECONDS_PER_HOUR
  //         if (downtime) {
  //             schedule.push(<Downtime duration={downtime} key={uuid()} isFirstProcess={isFirstProcess} isLastProcess={isLastProcess} />)
  //         }

  //         schedule.push(<Process order_process={order_process} isFirstProcess={isFirstProcess} isLastProcess={isLastProcess} key={_id } index={index} />)

  //         endHour = processEndTime

  //     })

  //     return schedule
  // }

  static createEndDate = (startDate, filtering) => {
    // return startDate
    const addWeeks = filtering ? WEEKS_PAGINATION_FOR_FILTERED : WEEKS_PAGINATION;
    const endDate = moment(startDate).add(addWeeks, 'weeks').toDate();
    return this.formatDate(endDate);
  };

  static getDecimalFormattedStartTime = (startTime) => {
    const startDecimalHours = moment.duration(startTime).asHours();
    return startDecimalHours;
  };

  static createNewStartDate = (date) => {
    const nextDay = moment(date).add(1, 'day').toDate();
    return this.formatDate(nextDay);
  };

  static formatDate = (date) => {
    return moment(date).set({ hour: 14, minute: 0, second: 0 }).toISOString();
  };

  static createInitialDate = () => {
    return this.formatDate(new Date());
  };

  static parseId = (droppableId) => {
    const dateAndUser = droppableId.split('|');
    const dateAndUserObject = dateAndUser.reduce((result, keyAndValue) => {
      const [key, value] = keyAndValue.split('===');
      result[key] = value;
      return result;
    }, {});

    return dateAndUserObject;
  };

  static createDroppableId = (date, userId, subDepartments) =>
    `date===${date}|user_id===${userId}|sub_departments===${subDepartments}`;

  static createDragableId = (processId, userId, subDepartment) =>
    `process_id===${processId}|user_id===${userId}|sub_department_id===${subDepartment}`;

  static checkSameDay = (date1, date2) => {
    const isSame = moment(date1).isSame(date2, 'date');
    return isSame;
  };
}

export default MonthyResourceTools;
