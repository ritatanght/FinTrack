import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "firebaseui/dist/firebaseui.css";

const firebaseConfig = {
  apiKey: "AIzaSyD2admq6Ly4mfSWXw30FC_UvCJsyy87X4Y",
  authDomain: "fintrack-live.firebaseapp.com",
  projectId: "fintrack-live",
  storageBucket: "fintrack-live.appspot.com",
  messagingSenderId: "828622287774",
  appId: "1:828622287774:web:309ed904e6a13270fe5c8f",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
