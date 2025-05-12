import moment from 'moment';

// INFO: find start and end date from weeks arr

export const findRangeOfDatesFromWeeksArr = (dates_arr) => {
  if (!dates_arr || dates_arr.length === 0) {
    return { start: null, end: null };
  }

  const sortedDates = [...dates_arr].sort(
    (a, b) => new Date(a.start_week) - new Date(b.start_week),
  );
  const start_week_date = sortedDates[0].start_week;
  const end_week_date = sortedDates[sortedDates.length - 1].end_week;

  return { start: start_week_date, end: end_week_date };
};

// INFO: find last date from orders array
export const findOnlyLastOrderDateFromOrdersArr = (ordersData) => {
  if (!ordersData || ordersData.length === 0) {
    return null; // Handle empty array case
  }

  const lastOrder = ordersData[ordersData.length - 1];

  return lastOrder.processes.reduce((maxDate, process) => {
    return process.process_date > maxDate ? process.process_date : maxDate;
  }, 0);
};

// INFO: find the orders dates that will be on the dashboard  --> not for scroll!
export const findOrderDates = (ordersData) => {
  if (!ordersData || ordersData.length === 0) {
    return []; // Handle empty array case
  }

  const lastOrder = ordersData[ordersData.length - 1];
  const latestProcessDate = lastOrder.processes.reduce((maxDate, process) => {
    return process.process_date > maxDate ? process.process_date : maxDate;
  }, 0);

  const startWeek = moment(new Date()).subtract(2, 'weeks').startOf('week').format('YYYY-MM-DD');
  const endWeek = moment(latestProcessDate).endOf('week').format('YYYY-MM-DD');

  return weeksGenerator(startWeek, endWeek);
};

// INFO: generate the number of week for the weeks bar
export const weeksGenerator = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result = [];

  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 7)) {
    const startOfWeek = moment(dt).startOf('week');
    const endOfWeek = moment(dt).endOf('week');

    result.push({
      week: moment(dt).week(),
      holiday: false,
      week_dates: `${startOfWeek.format('l').slice(0, -5)} - ${endOfWeek.format('l').slice(0, -5)}`,
      start_week: startOfWeek.format('YYYY-MM-DD'),
      end_week: endOfWeek.format('YYYY-MM-DD'),
      year: startOfWeek.year(),
      start_day_formated: startOfWeek.format('l'),
    });
  }

  return result;
};

export const daysGenerator = (startDate, endDate, daysOff = []) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hebrewDaysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const result = [];
  for (let i = 0; i < diff; i++) {
    const currentDay = moment(start).add(i, 'days');
    if (!daysOff.includes(currentDay.day())) {
      result.push({
        week: hebrewDaysOfWeek[currentDay.day()],
        holiday: false,
        week_dates: currentDay.format('YYYY/MM/DD'),
        start_week: start,
        end_week: end,
        year: currentDay.year(),
        start_day_formated: currentDay.format('YYYY/MM/DD'),
      });
    }
  }

  return result;
};

//add number of months when scrolling left:
export const addMonthsToWeeksArr = (numberOfMonths, weeksArr, isDaysView = false, daysOff = []) => {
  const weeksArrCopy = weeksArr.map((week) => ({ ...week })); // Deep copy

  const lastWeek = weeksArrCopy[weeksArrCopy.length - 1];
  const startDate = isDaysView ? new Date(lastWeek.week_dates) : lastWeek.start_week;

  const newStartTime = moment(startDate)
    .add(isDaysView ? 0 : 1, 'weeks') // Adjust based on days or weeks view
    .add(1, 'days'); // Add 1 day to move to the next week/day

  const newEndTime = moment(newStartTime).add(numberOfMonths, isDaysView ? 'days' : 'weeks');

  const additionalMonths = isDaysView
    ? daysGenerator(newStartTime.format('YYYY-MM-DD'), newEndTime.format('YYYY-MM-DD'), daysOff)
    : weeksGenerator(newStartTime.format('YYYY-MM-DD'), newEndTime.format('YYYY-MM-DD'));

  return [...weeksArrCopy, ...additionalMonths];
};
