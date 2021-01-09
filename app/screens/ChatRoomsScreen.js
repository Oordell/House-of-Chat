import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, LogBox } from "react-native";

import ActivityIndicatorOverlay from "../components/overlays/ActivityIndicatorOverlay";
import AppButton from "../components/buttons/AppButton";
import AppButtonSmall from "../components/buttons/AppButtonSmall";
import AppText from "../components/AppText";
import authStorage from "../auth/storage";
import chatRoomsApi from "../api/chatRooms";
import dbRooms from "../api/chatRooms";
import ListItem from "../components/ListItem";
import routs from "../navigation/routs";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import usersApi from "../api/users";
import UserImage from "../components/UserImage";

// Ignoring warnings.
LogBox.ignoreLogs([
  // Some splash screen warning that Expo-team is set to fix in the future. Nothing I can do about it.
  "[Unhandled promise rejection: Error: No native splash screen registered for given view controller.",
]);

function ChatRoomsScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [rooms, setRooms] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  useEffect(() => {
    getChatRooms();
  }, []);

  const getChatRooms = async () => {
    setLoadingUpdates(true);
    const rooms = await dbRooms.getAllRooms();
    setRooms(rooms);
    setLoadingUpdates(false);
  };

  const handleSignOut = () => {
    logOut();
    authStorage.removeAuthToken();
    usersApi.signOutUser();
  };

  const handleAddChatRoom = async () => {
    await chatRoomsApi.createNewChatRoom(
      "New Room",
      "A description of the new room."
    );
    getChatRooms();
  };

  return (
    <Screen>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={
          rooms
            ? rooms.sort(
                (a, b) =>
                  b.data().latestUpdate.toDate().getTime() -
                  a.data().latestUpdate.toDate().getTime()
              )
            : []
        }
        keyExtractor={(room) => room.id.toString()}
        ListHeaderComponent={
          <View style={styles.userInfo}>
            <UserImage imageUri={user.pictureUrl} />
            <AppText style={styles.userName}>{user.fullName}</AppText>
            <AppButtonSmall iconName="plus" onPress={handleAddChatRoom} />
          </View>
        }
        renderItem={({ item }) => (
          <ListItem
            title={item.data().name}
            subTitle={item.data().description}
            lastUpdate={item.data().latestUpdate.toDate().getTime()}
            onPress={() =>
              navigation.navigate(routs.CHAT, {
                name: item.data().name,
                id: item.id,
              })
            }
          />
        )}
        refreshing={refreshing}
        onRefresh={() => getChatRooms()}
        ListFooterComponentStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <AppButton
              title="sign out"
              onPress={handleSignOut}
              color="delete"
            />
          </View>
        }
      />
      <ActivityIndicatorOverlay visible={loadingUpdates} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    margin: 15,
  },
  userInfo: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  userName: {
    marginHorizontal: 10,
  },
});

export default ChatRoomsScreen;
