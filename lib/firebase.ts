import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAl1GZGGtwLF_e6hk9HV8l-herQPqrWdVg",
  authDomain: "mail-connector-f3894.firebaseapp.com",
  projectId: "mail-connector-f3894",
  storageBucket: "mail-connector-f3894.firebasestorage.app",
  messagingSenderId: "722897721365",
  appId: "1:722897721365:web:a8e4d7389c6f1135d0d61c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);