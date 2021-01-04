import React, { useEffect } from "react";
import { LogBox } from "react-native";
import db from "./app/config/db";
import ChatRoomsScreen from "./app/screens/ChatRoomsScreen";

// Ignoring warnings.
LogBox.ignoreLogs([
  // This is from Firebase and only on Android. Currently there is no fix.
  "Setting a timer for a long period of time, i.e. multiple minutes",
]);

export default function App() {
  useEffect(() => {
    db();
  }, []);

  return <ChatRoomsScreen />;
}
