import Constants from "expo-constants";

const settings = {
  dev: {
    facebookAppId: "2744554949143350",
    androidClientId: `484111970657-amubi6i9sk0r6m68e7qk6r7an494550b.apps.googleusercontent.com`,
    iosClientId: `484111970657-040ubgnakqglmt3a1gk5vauqvvg22onq.apps.googleusercontent.com`,
  },
  staging: {
    facebookAppId: "2744554949143350",
    androidClientId: `484111970657-amubi6i9sk0r6m68e7qk6r7an494550b.apps.googleusercontent.com`,
    iosClientId: `484111970657-040ubgnakqglmt3a1gk5vauqvvg22onq.apps.googleusercontent.com`,
  },
  prod: {
    facebookAppId: "2744554949143350",
    androidClientId: `484111970657-amubi6i9sk0r6m68e7qk6r7an494550b.apps.googleusercontent.com`,
    iosClientId: `484111970657-040ubgnakqglmt3a1gk5vauqvvg22onq.apps.googleusercontent.com`,
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
