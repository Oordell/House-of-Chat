import * as Sentry from "sentry-expo";

const start = () => {
  Sentry.init({
    dsn:
      "https://1d8b9820c8d440adb55ba69c00c3e718@o461547.ingest.sentry.io/5584976",
    enableInExpoDevelopment: true,
    debug: true, // Set this to `false` in production.
  });
};

const logError = (error) => Sentry.Native.captureException(error);

const logMessage = (message) => Sentry.Native.captureMessage(message);

const logEvent = (_event) => Sentry.Native.captureEvent(_event);

export default {
  logError,
  logEvent,
  logMessage,
  start,
};
