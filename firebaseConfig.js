
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX2jK71ASELJiZrM1dxpdOKHsVFSRZmFw",
  authDomain: "trucksy-6dfe3.firebaseapp.com",
  projectId: "trucksy-6dfe3",
  storageBucket: "trucksy-6dfe3.appspot.com",
  messagingSenderId: "361423266205",
  appId: "1:361423266205:web:30ac5219ce66a756e20f74",
  measurementId: "G-RWFRQR5E3K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
