const start = () => {
  console.log(
    "Starting logger... Replace this statement when logger is implimented.."
  );
};

const logError = (error) => {
  console.log(error);
};

const logMessage = (message) => {
  console.log(message);
};

const logEvent = (_event) => {
  console.log(_event);
};

export default {
  logError,
  logEvent,
  logMessage,
  start,
};
