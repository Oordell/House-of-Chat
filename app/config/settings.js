import Constants from "expo-constants";

const settings = {
  dev: {
    facebookAppId: "2744554949143350",
    androidClientId: `1086866507019-6rq8fhvl5crkq0lhjtu0htq9seor0ahp.apps.googleusercontent.com`,
    iosClientId: `1086866507019-et25aeisfvk2jlg07cq8c41fg4ddcbi6.apps.googleusercontent.com`,
  },
  staging: {
    facebookAppId: "2744554949143350",
    androidClientId: `1086866507019-6rq8fhvl5crkq0lhjtu0htq9seor0ahp.apps.googleusercontent.com`,
    iosClientId: `1086866507019-et25aeisfvk2jlg07cq8c41fg4ddcbi6.apps.googleusercontent.com`,
  },
  prod: {
    facebookAppId: "2744554949143350",
    androidClientId: `1086866507019-6rq8fhvl5crkq0lhjtu0htq9seor0ahp.apps.googleusercontent.com`,
    iosClientId: `1086866507019-et25aeisfvk2jlg07cq8c41fg4ddcbi6.apps.googleusercontent.com`,
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
