import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import signInWithSoMe from "../auth/signInWithSoMe";

function LoginScreen(props) {
  const { logIn } = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleFacebookLogin = async () => {
    const user = await signInWithSoMe.facebookSignIn();
    if (!user) setLoginFailed(true);
    else {
      setLoginFailed(true);
      logIn(user);
    }
  };

  const handleGoogleLogin = async () => {
    const user = await signInWithSoMe.googleSignIn();
    if (!user) setLoginFailed(true);
    else {
      setLoginFailed(true);
      logIn(user);
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
