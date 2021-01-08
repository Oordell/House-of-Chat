import settings from "../config/settings";
import logger from "../utility/logger";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import * as firebase from "firebase";
import authStorage from "./storage";
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
      const user = createUserObject(userInfo, LOGIN_METHODE.facebook);
      facebookFirebaseSignIn({ ...user, token });

      return null; // user;
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
      // Check if we are already signed-in Firebase with the correct user.
      if (!isFacebookUserEqual(facebookUser, firebaseUser)) {
        // Build Firebase credential with the Facebook auth token.
        const credential = firebase.auth.FacebookAuthProvider.credential(
          facebookUser.token
        );

        // Sign in with the credential from the Facebook user.
        try {
          await firebase.auth().signInWithCredential(credential);
        } catch (error) {
          logger.logMessage(
            "Error trying to sign in user with Facebook and Firebase."
          );
          logger.logError(error);
        }
      } else {
        // User is already signed-in Firebase with the correct user.
        logger.logMessage(
          "User is already signed in to Firebase with Facebook."
        );
      }
    });
};

function isFacebookUserEqual(facebookAuthResponse, firebaseUser) {
  if (firebaseUser) {
    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
        providerData[i].uid === facebookAuthResponse.id
      ) {
        // We don't need to re-auth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

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

const googleFirebaseSignIn = (googleUser) => {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  const unsubscribe = firebase
    .auth()
    .onAuthStateChanged(async (firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isGoogleUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        try {
          // Sign in with credential from the Google user.
          await firebase.auth().signInWithCredential(credential);

          const userInfo = createUserObject(
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

const isGoogleUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.user.id
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
};

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
