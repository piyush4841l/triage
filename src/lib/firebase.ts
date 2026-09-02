import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZ105fy5UEuaRfeag_4qiAD95Khya12Fw",
  authDomain: "smart-triage-51e87.firebaseapp.com",
  projectId: "smart-triage-51e87",
  storageBucket: "smart-triage-51e87.firebasestorage.app",
  messagingSenderId: "777031136085",
  appId: "1:777031136085:web:d42f1ee4477deb5a1f35dc",
  measurementId: "G-4VF57T3SH7"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
