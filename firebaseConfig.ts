import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB_jjJEXU7yvJv49aiPCJqEZgiyfJEJzrg",
    authDomain: "pmmdb-89a3f.firebaseapp.com",
    databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com",
    projectId: "pmmdb-89a3f",
    storageBucket: "pmmdb-89a3f.appspot.com",
    messagingSenderId: "269517012553",
    appId: "1:269517012553:web:f596b9536963ae20148998",
    measurementId: "G-8LFX4M3PGS"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getDatabase(app);