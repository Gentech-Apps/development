export const replaceProcessInState = (newProcess, state) => {
  let stateCopy = JSON.parse(JSON.stringify(state));

  let newState = stateCopy.map((process) => {
    if (process._id === newProcess._id || process.original === newProcess._id) {
      return newProcess;
    } else {
      return process;
    }
  });
  return newState;
};
