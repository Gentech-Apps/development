import { Rifm } from 'rifm';

export const replaceProcessInState = (newProcess, state) => {
  let stateCopy = JSON.parse(JSON.stringify(state));
  let newState = stateCopy.map((day) => {
    return {
      ...day,
      dayData: day.dayData.map((order) => {
        if (order.proccess._id === newProcess._id || order.proccess.original === newProcess._id) {
          if (order.proccess.original) {
            return { ...order, original: order.proccess.original, proccess: newProcess };
          } else {
            return { ...order, proccess: newProcess };
          }
        } else {
          return { ...order };
        }
      }),
    };
  });

  return newState;
};

export const removeFractionsOnBacklogDrag = (process, oldState) => {
  let newState = JSON.parse(JSON.stringify(oldState));
  let idToRemove = process.original ? process.original : process._id;
  newState = newState.map((day) => {
    return {
      ...day,
      dayData: day.dayData.filter((order) => {
        if (order.proccess.original || order.proccess._id === idToRemove) {
          if (order.proccess.backlog) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }),
    };
  });

  return oldState;
};

export const removeBacklogDuplications = (process, oldState) => {
  let newState = JSON.parse(JSON.stringify(oldState));
  newState = newState.map((day) => {
    return {
      ...day,
      dayData: day.dayData.filter((order) => {
        if (order.proccess.original && order.proccess.original === process._id) {
          return false;
        } else {
          return true;
        }
      }),
    };
  });

  return newState;
};

export const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};
