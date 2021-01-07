import React, { useState } from "react";
import { LogBox } from "react-native";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import db from "./app/config/db";
import LoginScreen from "./app/screens/LoginScreen";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import ChatNavigator from "./app/navigation/ChatNavigator";
import navigationTheme from "./app/navigation/navigationTheme";

// Ignoring warnings.
LogBox.ignoreLogs([
  // This is from Firebase and only effects Android. Currently there is no fix.
  "Setting a timer for a long period of time, i.e. multiple minutes",
  // This is from Gifted Chats impimentation. So far it seams it can be ignored.
  "Animated.event now requires a second argument for options",
  "Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`",
]);

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const startup = async () => {
    db();

    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  if (!isReady)
    return (
      <AppLoading
        startAsync={startup}
        onFinish={() => {
          setIsReady(true);
        }}
        onError={console.warn}
      />
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer theme={navigationTheme}>
        {user ? <ChatNavigator /> : <LoginScreen />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
