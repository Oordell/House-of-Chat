const sendNotificationToUser = (expoPushToken, roomName, roomId) => {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      title: "New Message",
      body: `Someone posted a new message in ${roomName}.`,
      data: {
        id: roomId,
        name: roomName,
      },
    }),
  });
};

export default {
  sendNotificationToUser,
};
