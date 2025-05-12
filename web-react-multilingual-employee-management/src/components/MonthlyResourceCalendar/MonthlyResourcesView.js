export const replaceProcessInState = (newProcess, state) => {
  const stateCopy = [...state];

  return stateCopy.map((day) => ({
    ...day,
    dayData: day.dayData.map((userData) =>
      userData?.value?.length > 0
        ? userData.value.map((p) =>
            p.proccess._id === newProcess._id || p.proccess.original === newProcess._id
              ? { ...p, proccess: newProcess, original: p.proccess.original || p.proccess._id }
              : p,
          )
        : userData,
    ),
  }));
};

export const removeFractionsOnBacklogDrag = (process, oldState) => {
  const newState = [...oldState];

  const idToRemove = process.original ? process.original : process._id;

  return newState.map((day) => ({
    ...day,
    dayData: day.dayData.map((userData) =>
      userData?.value?.length > 0
        ? userData.value.filter(
            (p) => (p.proccess.original || p.proccess._id === idToRemove) === p.proccess.backlog,
          )
        : userData,
    ),
  }));
};

export const removeBacklogDuplications = (process, oldState) => {
  const newState = [...oldState];

  return newState.map((day) => ({
    ...day,
    dayData: day.dayData.map((userData) =>
      userData?.value?.length > 0
        ? userData.value.filter((p) => !p.proccess.original || p.proccess.original !== p._id)
        : userData,
    ),
  }));
};

export const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};
