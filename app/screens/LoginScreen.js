import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import * as Facebook from "expo-facebook";
import logger from "../utility/logger";
import authStorage from "../auth/storage";
import * as firebase from "firebase";
import settings from "../config/setting";
import useAuth from "../auth/useAuth";
import * as Google from "expo-google-app-auth";
import setting from "../config/setting";

const LOGIN_METHODE = {
  facebook: "FACEBOOK",
  google: "GOOGLE",
};

function LoginScreen(props) {
  const { logIn } = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleFacebookLogin = async () => {
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
          logger.logMessage("Error fetching the users info...");
          logger.logError(error);
          return setLoginFailed(true);
        }

        const userInfo = await response.json();
        const user = createUserObject(userInfo, LOGIN_METHODE.facebook);

        setLoginFailed(false);
        logIn(user);
      } else {
        logger.logMessage("User canceled login with facebook.");
        return setLoginFailed(true);
      }
    } catch (error) {
      logger.logMessage("Error trying to login with Facebook.");
      logger.logError(error);
      return setLoginFailed(true);
    }
  };

  const handleGoogleLogin = async () => {
    const config = {
      androidClientId: settings.androidClientId,
      iosClientId: setting.iosClientId,
      scopes: ["profile", "email"],
    };

    try {
      const { type, accessToken, user: userInfo } = await Google.logInAsync(
        config
      );

      if (type === "success") {
        authStorage.storeAuthToken({
          token: accessToken,
          expirationDate: null,
        });
        const user = createUserObject(userInfo, LOGIN_METHODE.google);

        setLoginFailed(false);
        logIn(user);
      } else {
        logger.logMessage("Sign in with Google was not successful...");
      }
    } catch (error) {
      logger.logMessage("Error trying to login with Google.");
      logger.logError(error);
      return setLoginFailed(true);
    }
  };

  const createUserObject = (userInfo, logInMethode) => {
    const commonAttributes = {
      fullName: userInfo.name,
      email: userInfo.email,
      _id: userInfo.id,
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

  return (
    <Screen style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/adaptive-icon.png")}
          style={styles.logo}
        />
        <AppText style={styles.text}>Lets chat!</AppText>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="Sign in with Facebook"
          iconName="facebook"
          onPress={handleFacebookLogin}
        />
        <AppButton
          title="Sign in with Google"
          iconName="google"
          onPress={handleGoogleLogin}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  logo: {
    resizeMode: "cover",
    width: 300,
    height: 300,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -70,
  },
});

export default LoginScreen;
