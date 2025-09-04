// FIX: Use Firebase v9 compat imports to support the v8 syntax used throughout the application.
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
  databaseURL: "https://message-28025-default-rtdb.firebaseio.com/",
  storageBucket: "message-28025.appspot.com",
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get a reference to the database service
export const db = firebase.database();
export const storage = firebase.storage();