// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwpuu2du4uVrE6BUCz9hF9bFYnv8wQg_4",
  authDomain: "tr-1fm.firebaseapp.com",
  projectId: "tr-1fm",
  storageBucket: "tr-1fm.appspot.com",
  messagingSenderId: "619036109826",
  appId: "1:619036109826:web:3d4816d4e205b6fa5b0b1b",
  measurementId: "G-56Y4GJ8PMR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
