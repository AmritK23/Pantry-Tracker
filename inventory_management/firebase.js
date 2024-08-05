// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmLJ8N5Ph4akGl3M3sTg4UVK1AG-E7AxE",
  authDomain: "inventory-management-f7c46.firebaseapp.com",
  projectId: "inventory-management-f7c46",
  storageBucket: "inventory-management-f7c46.appspot.com",
  messagingSenderId: "803918386076",
  appId: "1:803918386076:web:49457ee67876ae15c72e59",
  measurementId: "G-J6P4GV35YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}