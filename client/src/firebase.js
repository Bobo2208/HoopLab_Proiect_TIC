import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCacAWtFmkNnxUrC_FQga44_heDySpJ8Lo",
  authDomain: "hooplab-tic.firebaseapp.com",
  projectId: "hooplab-tic",
  storageBucket: "hooplab-tic.firebasestorage.app",
  messagingSenderId: "117957774492",
  appId: "1:117957774492:web:2f40a44edf2df82d1eb159",
  measurementId: "G-Z1N01M9GDW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 