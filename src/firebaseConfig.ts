import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com/",
  storageBucket: "pmmdb-89a3f.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getDatabase(app);