// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCr65wqaeiBtiELGp10FsDgOsi04N3iw3I",
    authDomain: "readhub-4b632.firebaseapp.com",
    projectId: "readhub-4b632",
    storageBucket: "readhub-4b632.appspot.com",
    messagingSenderId: "860522413760",
    appId: "1:860522413760:web:1bb6f8377866085c687725",
    measurementId: "G-W9EFK88MNH"
};

// Initialize Firebase
const app = initializeApp( firebaseConfig )
const analytics = getAnalytics( app )
const auth = getAuth( app );
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };