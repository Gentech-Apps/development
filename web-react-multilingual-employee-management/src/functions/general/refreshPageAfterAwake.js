export const refreshPageAfterAwake = () => {
  const TIMEOUT = 60000; // 60 seconds (1 minute)
  let lastTime = Date.now();

  setInterval(() => {
    const currentTime = Date.now();
    if (currentTime - lastTime > TIMEOUT + 5000) {
      location.reload();
    }
    lastTime = currentTime;
  }, TIMEOUT);
};
