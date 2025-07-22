
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfo-u-pclxHs76OvfsZPCPwjFTZe-hwbE",
  authDomain: "jobprep-3a6cd.firebaseapp.com",
  projectId: "jobprep-3a6cd",
  storageBucket: "jobprep-3a6cd.firebasestorage.app",
  messagingSenderId: "128808911405",
  appId: "1:128808911405:web:4d86e61548512fed2eeea4",
  measurementId: "G-ZYQCV1XY82"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);