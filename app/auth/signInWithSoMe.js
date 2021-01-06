import settings from "../config/settings";
import logger from "../utility/logger";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import * as firebase from "firebase";
import authStorage from "./storage";
import usersApi from "../api/users";
import apiEndpoints from "../api/endpoints";

const LOGIN_METHODE = {
  facebook: "FACEBOOK",
  google: "GOOGLE",
};

const facebookSignIn = async () => {
  try {
    await Facebook.initializeAsync({ appId: settings.facebookAppId });
    const {
      type,
      token,
      expirationDate,
    } = await Facebook.logInWithReadPermissionsAsync();

    if (type === "success") {
      authStorage.storeAuthToken({ token, expirationDate });

      let response;
      try {
        response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,first_name,last_name,email,picture.height(500)`
        );
      } catch (error) {
        logger.logMessage("Error fetching the users info.");
        logger.logError(error);
        return null;
      }

      const userInfo = await response.json();
      return createUserObject(userInfo, LOGIN_METHODE.facebook);
    } else {
      logger.logMessage("User canceled sign in with Gacebook.");
      return setLoginFailed(true);
    }
  } catch (error) {
    logger.logMessage("Error trying to login with Facebook.");
    logger.logError(error);
    return null;
  }
};

const facebookFirebaseSignIn = async () => {};

const googleSignIn = async () => {
  const config = {
    androidClientId: settings.androidClientId,
    iosClientId: settings.iosClientId,
    scopes: ["profile", "email"],
  };

  try {
    const result = await Google.logInAsync(config);

    if (result.type === "success") {
      authStorage.storeAuthToken({
        token: result.accessToken,
        expirationDate: null,
      });

      googleFirebaseSignIn(result);
      return createUserObject(result.user, LOGIN_METHODE.google);
    } else {
      logger.logMessage("User canceled sign in with Google.");
    }
  } catch (error) {
    logger.logMessage("Error trying to login with Google.");
    logger.logError(error);
  }
};

const googleFirebaseSignIn = (googleUser) => {};

const isUserEqual = async (googleUser, firebaseUser) => {};

const createUserObject = (userInfo, logInMethode) => {
  const commonAttributes = {
    fullName: userInfo.name,
    email: userInfo.email,
    _id: userInfo.id,
    lastSignIn: firebase.firestore.Timestamp.now(),
  };

  if (logInMethode === LOGIN_METHODE.facebook) {
    return {
      ...commonAttributes,
      firstName: userInfo.first_name,
      lastName: userInfo.lastName,
      pictureUrl: userInfo.picture.data.url,
    };
  } else if (logInMethode === LOGIN_METHODE.google) {
    return {
      ...commonAttributes,
      firstName: userInfo.givenName,
      lastName: userInfo.familyName,
      pictureUrl: userInfo.photoUrl,
    };
  }
};

export default {
  facebookSignIn,
  googleSignIn,
};
