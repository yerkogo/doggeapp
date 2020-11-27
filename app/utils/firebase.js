import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAMTRRxeQpXUGOmimw9uPegDyarGOF6pw8",
    authDomain: "dogge-app.firebaseapp.com",
    databaseURL: "https://dogge-app.firebaseio.com",
    projectId: "dogge-app",
    storageBucket: "dogge-app.appspot.com",
    messagingSenderId: "499851652847",
    appId: "1:499851652847:web:3ac4f405f3c99c395c751a"

};

export const firebaseApp = firebase.initializeApp(firebaseConfig);