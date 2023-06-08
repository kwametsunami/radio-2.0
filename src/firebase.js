// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbqTUIqnQE6jRKlNXpf2w8OePYs57ScVE",
  authDomain: "tr1fm-e6e79.firebaseapp.com",
  databaseURL: "https://tr1fm-e6e79-default-rtdb.firebaseio.com",
  projectId: "tr1fm-e6e79",
  storageBucket: "tr1fm-e6e79.appspot.com",
  messagingSenderId: "655066508921",
  appId: "1:655066508921:web:c233f9f0be15231c1daea8",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;
