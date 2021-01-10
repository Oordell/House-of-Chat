import * as firebase from "firebase";

export default () => {
  const firebaseConfig = {
    apiKey: "AIzaSyC6reMVaa1ojogZ4djruaAJcnT190EWswU",
    authDomain: "newhouseofchat.firebaseapp.com",
    projectId: "newhouseofchat",
    storageBucket: "newhouseofchat.appspot.com",
    messagingSenderId: "1086866507019",
    appId: "1:1086866507019:web:c30e3ef73e3a0794044e0e",
  };

  if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
};
