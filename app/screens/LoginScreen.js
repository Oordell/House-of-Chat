import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import signInWithSoMe from "../auth/signInWithSoMe";
import ActivityIndicatorOverlay from "../components/ActivityIndicatorOverlay";
import ErrorOverlay from "../components/ErrorOverlay";

function LoginScreen(props) {
  const { logIn } = useAuth();
  const [signInFailed, setSignInFailed] = useState(false);
  const [signInPressed, setSignInPressed] = useState(false);

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
      <ActivityIndicatorOverlay visible={signInPressed} />
      <ErrorOverlay
        visible={signInFailed}
        toggleOverlay={toggleOverlayVisible}
      />
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
