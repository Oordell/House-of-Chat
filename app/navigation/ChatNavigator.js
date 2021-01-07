import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import routs from "./routs";
import ChatRoomsScreen from "../screens/ChatRoomsScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={routs.CHATROOMS} component={ChatRoomsScreen} />
    <Stack.Screen name={routs.CHAT} component={ChatScreen} />
  </Stack.Navigator>
);

export default ChatNavigator;
