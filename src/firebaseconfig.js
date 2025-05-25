// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQz6R_UIQjImiyZHLoA0tmNnNyqxiR_hM",
  authDomain: "codewallet-b7250.firebaseapp.com",
  projectId: "codewallet-b7250",
  storageBucket: "codewallet-b7250.firebasestorage.app",
  messagingSenderId: "361837091767",
  appId: "1:361837091767:web:2ed8798f96b8dcc25be632",
  measurementId: "G-252QZ053G7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);