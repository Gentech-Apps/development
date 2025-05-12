export const replaceProcessInState = (newProcess, state) => {
  let stateCopy = JSON.parse(JSON.stringify(state));
  let newState = stateCopy.map((row) => {
    return {
      ...row,
      processes: row.processes.map((day) => {
        return day.map((process) => {
          if (process._id === newProcess._id || process.original === newProcess._id) {
            return newProcess;
          } else {
            return process;
          }
        });
      }),
    };
  });
  return newState;
};

export const removeFractionsOnBacklogDrag = (originProcess, oldState) => {
  let newState = JSON.parse(JSON.stringify(oldState));
  let idToRemove = originProcess.original ? originProcess.original : originProcess._id;
  newState = newState.map((order) => {
    return {
      ...order,
      processes: order.processes.map((processArray) => {
        return processArray.filter((process) => {
          if (
            (process._id === idToRemove && !process.backlog) ||
            (process.original === idToRemove && !process.backlog)
          ) {
            return false;
          } else {
            return true;
          }
        });
      }),
    };
  });
  return newState;
};

export const removeBacklogDuplications = (processParam, oldState) => {
  let newState = JSON.parse(JSON.stringify(oldState));
  newState = newState.map((order) => {
    return {
      ...order,
      processes: order.processes.map((processArray) => {
        return processArray.filter((process) => {
          if (processParam._id === process.original && process.original !== process._id) {
            return false;
          }
          return true;
        });
      }),
    };
  });
  return newState;
};

export const findOriginalProcess = (fractionProcess, weeklyOrders) => {
  let idToFind = fractionProcess.original || fractionProcess._id;

  let newState = weeklyOrders.map((topLevelItem) => {
    return {
      ...topLevelItem,
      processes: topLevelItem.processes.map((day) => {
        return day.map((process) => {
          if (process._id === idToFind) {
            return { ...process, backlog: true };
          } else {
            return { ...process };
          }
        });
      }),
    };
  });
  return newState;
};

export const buildCountingObj = (daysArray) => {
  let countingObj = {};
  daysArray.map((day) => {
    day.map((process) => {
      if (!countingObj[process.original]) {
        countingObj[process.original] = 1;
      } else {
        countingObj[process.original] = countingObj[process.original] + 1;
      }
    });
  });

  return countingObj;
};
