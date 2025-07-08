// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAc3qV19yXPI28PD1hMaL-biIaU3pZycs0",
  authDomain: "studium-fc40f.firebaseapp.com",
  projectId: "studium-fc40f",
  storageBucket: "studium-fc40f.appspot.com",
  messagingSenderId: "404454390469",
  appId: "1:404454390469:web:df6f7017fd47754a800eac",
  measurementId: "G-SYZKBVF5Y5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ✅ This export is what was missing or duplicated/conflicted
export { app, analytics, db };
