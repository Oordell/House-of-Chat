import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";

function LoginScreen(props) {
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
        <AppButton title="Login with Facebook" iconName="facebook" />
        <AppButton title="Login with Google" iconName="google" />
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
