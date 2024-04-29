// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { categories } from "./data/categories";
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

export const storage = getStorage(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const userRef = collection(db, "users");
export const categoriesRef = collection(db, "categories");

// categories.forEach(async (category) => {
//   try {
//     const docRef = await addDoc(categoriesRef, category);
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// });

// console.log("Categories added to Firestore successfully!");
