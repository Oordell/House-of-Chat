import * as firebase from "firebase";

export default () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBFPozGYSZ8CCqOrTplPDp_R7LdF3YbmWw",
    authDomain: "houseofchat-dec94.firebaseapp.com",
    projectId: "houseofchat-dec94",
    storageBucket: "houseofchat-dec94.appspot.com",
    messagingSenderId: "484111970657",
    appId: "1:484111970657:web:0edc51b5c8f62e85279520",
  };

  if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
};
