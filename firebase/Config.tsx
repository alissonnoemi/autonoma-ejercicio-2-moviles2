// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfIEgzUogfvVF4oAkFHMlhCSDRWUgDsXE",
    authDomain: "autonoma-app-94edb.firebaseapp.com",
    databaseURL: "https://autonoma-app-94edb-default-rtdb.firebaseio.com/",
    projectId: "autonoma-app-94edb",
    storageBucket: "autonoma-app-94edb.firebasestorage.app",
    messagingSenderId: "130716909301",
    appId: "1:130716909301:web:d6d2bcacb91a85b34c4fbc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);