import moment from 'moment';

// INFO: Custom calender Column generator for Weekly view
export const columnWeekGenerator = async (weeks_array, ordersData) => {
  const ordersDataCopy = JSON.parse(JSON.stringify(ordersData));
  const numberOfWeeks = weeks_array.length + 1;

  for (let i = 0; i < ordersData.length; i++) {
    ordersDataCopy[i].columnOrder = [];
    ordersDataCopy[i].columns = {};

    const processesWeekNums = ordersData[i].processes.map((p) => ({
      week: moment(new Date(p.process_date)).isoWeek(),
      date: p.process_date,
      id: p.process_id,
      name: p.process_name,
    }));

    for (let num = 1; num < numberOfWeeks; num++) {
      const columnId = `column-${num}`;
      const weekNumber = `week-${num}`;
      const weekIndex = num - 1;
      const weekNumObj = weeks_array[weekIndex];

      ordersDataCopy[i].columns[columnId] = {
        id: columnId,
        title: weekNumber,
        processId: [],
      };

      for (const process of processesWeekNums) {
        const processDate = process.date;
        const weekStart = moment(weekNumObj.start_week).format();
        const weekEnd = moment(weekNumObj.end_week).format();

        if (weekStart < processDate && processDate < weekEnd) {
          ordersDataCopy[i].columns[columnId].processId.push(process.id);
        }
      }

      ordersDataCopy[i].columnOrder.push(columnId);
    }
  }

  return ordersDataCopy;
};

// INFO: Custom calender Add new Column for Weekly view
export const addColumnWeeksGenerator = (
  number,
  ordersData,
  off_days_number = 0,
  mps_view = 'week',
) => {
  const newNumber = mps_view === 'week' ? number : number - off_days_number - 1;

  return Object.entries(ordersData).reduce((acc, [key, order]) => {
    const { columnOrder, columns } = order;
    const startCol = columnOrder.length + 1;

    for (let i = startCol; i < startCol + newNumber; i++) {
      const columnId = `column-${i}`;
      const weekId = `week-${i}`;
      columnOrder.push(columnId);
      columns[columnId] = {
        id: columnId,
        title: weekId,
        processId: [],
      };
    }

    acc[key] = { ...order, columnOrder, columns };
    return acc;
  }, {});
};
