// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGSbwG67z7TrGiIQTIewAJ_F_MvdW856s",
  authDomain: "ecoflipr-app.firebaseapp.com",
  projectId: "ecoflipr-app",
  storageBucket: "ecoflipr-app.appspot.com",
  messagingSenderId: "252447058660",
  appId: "1:252447058660:web:ec2345e00f486b1dc55af1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const userRef = collection(db, "users");
