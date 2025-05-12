var prevData = [];
var previousData = [];

export const sortProcessesWeeklyView = (data = []) => {
  const doneProcesses = data.filter(
    (process) => process.done || process.quantity === process.finished,
  );
  const activeProcesses = data.filter(
    (process) => !process.done && process.quantity !== process.finished && !process.start_date,
  );
  const sortedMoreThanOneDayProcesses = data
    .filter((process) => process.start_date)
    .sort((a, b) => (a.start_date < b.start_date ? -1 : 1));

  return [...sortedMoreThanOneDayProcesses, ...activeProcesses, ...doneProcesses];
};

export const sortProcessesMonthlyView = (data = []) => {
  const doneProcesses = data.filter(
    (process) =>
      process.proccess?.done || process.proccess?.quantity === process.proccess?.finished,
  );
  const activeProcesses = data.filter(
    (process) =>
      !process.proccess?.done &&
      process.proccess?.quantity !== process.proccess?.finished &&
      !process.proccess?.start_date,
  );
  const sortedMoreThanOneDayProcesses = data
    .filter((process) => process.proccess?.start_date)
    .sort((a, b) => (a.proccess.day_duration > b.proccess.day_duration ? -1 : 1));

  const currentData = [...sortedMoreThanOneDayProcesses, ...activeProcesses, ...doneProcesses];

  // Logic for comparing previous and current data (assuming uniqueness based on process_id and order_id)
  const processMap = new Map();
  for (const process of currentData) {
    const key = `${process.proccess.process_id}-${process.proccess.order_id}`;
    if (processMap.has(key)) {
      const prevProcess = processMap.get(key);
      processMap.set(key, currentData); // Assuming current data replaces previous for the same key
    } else {
      processMap.set(key, process);
    }
  }

  return currentData;
};

export const sortProcessesMonthlyRView = (date = '', data = []) => {
  const doneProcesses = data.reduce((acc, item) => {
    if (item?.value?.length > 0) {
      acc.push({
        key: item.key,
        value: item.value.filter(
          (i) => i?.proccess?.done || i?.proccess?.quantity === i?.proccess?.finished,
        ),
        heightWouldBe: item.heightWouldBe,
        user_name: item.user_name,
        overloaded: item.overloaded,
      });
    }
    return acc;
  }, []);

  const activeProcesses = data.reduce((acc, item) => {
    if (item?.value?.length > 0) {
      acc.push({
        key: item.key,
        value: item.value.filter(
          (i) =>
            !i?.proccess?.done &&
            i?.proccess?.quantity !== i?.proccess?.finished &&
            !i?.proccess?.start_date,
        ),
        heightWouldBe: item.heightWouldBe,
        user_name: item.user_name,
        overloaded: item.overloaded,
      });
    }
    return acc;
  }, []);

  const currentData = [...doneProcesses];

  activeProcesses.forEach((activeP) => {
    const matchingIndex = currentData.findIndex((cData) => cData.key === activeP.key);
    if (matchingIndex !== -1) {
      currentData[matchingIndex].value.push(...activeP.value);
    }
  });

  return currentData;
};
