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

  return (
    <Screen>
      <FlatList
        ListFooterComponentStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={rooms}
        keyExtractor={(room) => room.id.toString()}
        ListHeaderComponent={
          <View style={styles.userInfo}>
            <UserImage imageUri={user.pictureUrl} />
            <AppText style={styles.userName}>{user.fullName}</AppText>
          </View>
        }
        renderItem={({ item }) => (
          <ListItem
            title={item.data().name}
            subTitle={item.data().description}
            onPress={() => navigation.navigate(routs.CHAT, item.data())}
          />
        )}
        refreshing={refreshing}
        onRefresh={() => getChatRooms()}
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
  },
  userName: {
    marginLeft: 10,
  },
});

export default ChatRoomsScreen;
