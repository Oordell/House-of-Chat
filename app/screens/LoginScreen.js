import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import AppButton from "../components/buttons/AppButton";
import AppText from "../components/AppText";
import ErrorOverlay from "../components/overlays/ErrorOverlay";
import Screen from "../components/Screen";
import signInWithSoMe from "../auth/signInWithSoMe";
import useAuth from "../auth/useAuth";
import { ImageBackground } from "react-native";
import { Platform } from "react-native";

function LoginScreen(props) {
  const { logIn } = useAuth();
  const [signInFailed, setSignInFailed] = useState(false);

  const handleFacebookLogin = async () => {
    const user = await signInWithSoMe.facebookSignIn();
    if (!user) setSignInFailed(true);
    else {
      setSignInFailed(false);
      logIn(user);
    }
  };

  const handleGoogleLogin = async () => {
    const user = await signInWithSoMe.googleSignIn();
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
    resizeMode: "cover",
    width: 400,
    height: 400,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -100,
  },
});

export default LoginScreen;
