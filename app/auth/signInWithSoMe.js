import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import * as firebase from "firebase";

import authStorage from "./storage";
import logger from "../utility/logger";
import settings from "../config/settings";
import usersApi from "../api/users";

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
      const user = await createUserObject(userInfo, LOGIN_METHODE.facebook);
      facebookFirebaseSignIn({ ...user, token });
      usersApi.storeOrUpdateUser(user);

      return user;
    } else {
      logger.logMessage("User canceled sign in with Gacebook.");
    }
  } catch (error) {
    logger.logMessage("Error trying to login with Facebook.");
    logger.logError(error);
    return null;
  }
};

const facebookFirebaseSignIn = async (facebookUser) => {
  const unsubscribe = firebase
    .auth()
    .onAuthStateChanged(async (firebaseUser) => {
      unsubscribe();
      if (
        !isSoMeUserEqual(facebookUser, firebaseUser, LOGIN_METHODE.facebook)
      ) {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          facebookUser.token
        );

        try {
          await firebase.auth().signInWithCredential(credential);
        } catch (error) {
          logger.logMessage(
            "Error trying to sign in user with Facebook and Firebase."
          );
          logger.logError(error);
        }
      } else {
        logger.logMessage(
          "User is already signed in to Firebase with Facebook."
        );
      }
    });
};

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

      return await createUserObject(result.user, LOGIN_METHODE.google);
    } else {
      logger.logMessage("User canceled sign in with Google.");
    }
  } catch (error) {
    logger.logMessage("Error trying to login with Google.");
    logger.logError(error);
  }
};

const googleFirebaseSignIn = (googleUser) => {
  const unsubscribe = firebase
    .auth()
    .onAuthStateChanged(async (firebaseUser) => {
      unsubscribe();
      if (!isSoMeUserEqual(googleUser, firebaseUser, LOGIN_METHODE.google)) {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        try {
          await firebase.auth().signInWithCredential(credential);

          const userInfo = await createUserObject(
            googleUser.user,
            LOGIN_METHODE.google
          );
          usersApi.storeOrUpdateUser(userInfo);
        } catch (error) {
          logger.logMessage("Error trying to sing in user with credentials.");
          logger.logError(error);
        }
      } else {
        logger.logMessage("User already signed-in Firebase.");
      }
    });
};

const isSoMeUserEqual = (soMeUser, firebaseUser, soMePlatform) => {
  if (firebaseUser) {
    let userId;
    if (soMePlatform === LOGIN_METHODE.facebook) userId = soMeUser.id;
    else if (soMePlatform === LOGIN_METHODE.google) userId = soMeUser.user.id;

    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === userId
      ) {
        return true;
      }
    }
  }
  return false;
};

const createUserObject = async (userInfo, logInMethode) => {
  const userInDb = await usersApi.getUserIfExists(userInfo.id);

  const commonAttributes = {
    fullName: userInfo.name,
    email: userInfo.email,
    _id: userInfo.id,
    lastSignIn: firebase.firestore.Timestamp.now(),
    roomIdsUserHasChatedIn: userInDb ? userInDb.roomIdsUserHasChatedIn : [],
  };

  if (logInMethode === LOGIN_METHODE.facebook) {
    return {
      ...commonAttributes,
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
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
