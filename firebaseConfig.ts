// FIX: Use Firebase v9 compat imports to support the v8 syntax used throughout the application.
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com/",
  storageBucket: "pmmdb-89a3f.appspot.com",
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get a reference to the database service
export const db = firebase.database();