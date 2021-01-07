import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import dbRooms from "../api/chatRooms";
import ListItem from "../components/ListItem";
import AppButton from "../components/AppButton";
import authStorage from "../auth/storage";
import useAuth from "../auth/useAuth";
import usersApi from "../api/users";
import UserImage from "../components/UserImage";
import routs from "../navigation/routs";
import chatRoomsApi from "../api/chatRooms";

function ChatRoomsScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [rooms, setRooms] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getChatRooms();
  }, []);

  const getChatRooms = async () => {
    const rooms = await dbRooms.getAllRooms();

    setRooms(rooms);
  };

  const handleSignOut = () => {
    logOut();
    authStorage.removeAuthToken();
    usersApi.signOutUser();
  };

  const handleAddChatRoom = () => {
    chatRoomsApi.createNewChatRoom(
      "New Room",
      "A description of the new room."
    );
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
            <AppButton title="Add Chat Room" onPress={handleAddChatRoom} />
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
              color="notification"
            />
          </View>
        }
      />
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
    flex: 1,
  },
  userName: {
    marginHorizontal: 10,
  },
});

export default ChatRoomsScreen;
