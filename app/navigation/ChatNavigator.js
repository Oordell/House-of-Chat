import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CameraScreen from "../screens/CameraScreen";
import ChatRoomsScreen from "../screens/ChatRoomsScreen";
import ChatScreen from "../screens/ChatScreen";
import routs from "./routs";

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={routs.CHATROOMS} component={ChatRoomsScreen} />
    <Stack.Screen name={routs.CHAT} component={ChatScreen} />
    <Stack.Screen name={routs.CAMERA} component={CameraScreen} />
  </Stack.Navigator>
);

export default ChatNavigator;
