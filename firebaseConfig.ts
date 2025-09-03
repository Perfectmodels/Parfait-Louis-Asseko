import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  databaseURL: "https://message-28025-default-rtdb.firebaseio.com/",
  storageBucket: "message-28025.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getDatabase(app);
export const storage = getStorage(app);