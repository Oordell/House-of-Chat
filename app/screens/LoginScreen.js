import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "../components/buttons/AppButton";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ErrorOverlay from "../components/overlays/ErrorOverlay";
import signInWithSoMe from "../auth/signInWithSoMe";
import useAuth from "../auth/useAuth";

function LoginScreen(props) {
  const { logIn } = useAuth();
  const [signInFailed, setSignInFailed] = useState(false);
  const [singInPressed, setSignInPressed] = useState(false);

  const handleFacebookLogin = async () => {
    setSignInPressed(true);
    const user = await signInWithSoMe.facebookSignIn();
    setSignInPressed(false);
    if (!user) setSignInFailed(true);
    else {
      setSignInFailed(false);
      logIn(user);
    }
  };

  const handleGoogleLogin = async () => {
    setSignInPressed(true);
    const user = await signInWithSoMe.googleSignIn();
    setSignInPressed(false);
    if (!user) setSignInFailed(true);
    else {
      setSignInFailed(false);
      logIn(user);
    }
  };

  const toggleOverlayVisible = () => {
    setSignInFailed(!signInFailed);
  };

  return (
    <ImageBackground
      style={styles.container}
      imageStyle={{ opacity: 0.6, resizeMode: "cover" }}
      source={require("../assets/background.png")}
      blurRadius={Platform.OS === "ios" ? 7 : 2}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/adaptive-icon.png")}
          style={styles.logo}
        />
        <AppText style={styles.text}>Lets chat!</AppText>
      </View>
      {singInPressed && (
        <ActivityIndicator size="large" color={colors.text_light} />
      )}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Sign in with Facebook"
          iconName="facebook"
          color="facebook"
          onPress={handleFacebookLogin}
        />
        <AppButton
          title="Sign in with Google"
          iconName="google"
          color="google"
          onPress={handleGoogleLogin}
        />
      </View>
      <ErrorOverlay
        visible={signInFailed}
        toggleOverlay={toggleOverlayVisible}
      />
    </ImageBackground>
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
    height: 400,
    resizeMode: "cover",
    width: 400,
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -100,
  },
});

export default LoginScreen;
