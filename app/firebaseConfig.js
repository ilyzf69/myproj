import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCw3tcO0cLDtoM-PeixLqQX2NQ5HTiIqyw",
    authDomain: "feels-ia.firebaseapp.com",
    projectId: "feels-ia",
    storageBucket: "feels-ia.appspot.com",
    messagingSenderId: "865238307315",
    appId: "1:865238307315:web:bdcd9337daa513d7eb0286"
  };

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Exportez l'authentification pour l'utiliser dans votre application
export const auth = getAuth(app);