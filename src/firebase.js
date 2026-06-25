// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// GANTIKAN KOD DI BAWAH DENGAN CONFIG FIREBASE KAU SENDIRI
const firebaseConfig = {
  apiKey: "AIzaSyD_wY0S7El6gdnZ6C3B58g69U0DcTgnMxw",
  authDomain: "vlog-usm.firebaseapp.com",
  projectId: "vlog-usm",
  storageBucket: "vlog-usm.firebasestorage.app",
  messagingSenderId: "1097918591670",
  appId: "1:1097918591670:web:f1cfc2b10cf508cb696c17"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);