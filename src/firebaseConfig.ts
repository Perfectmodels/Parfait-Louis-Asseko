// Importation modulaire Firebase
import { initializeApp } from "firebase/app";
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

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Exportation de la base de données
export const db = getDatabase(app);
