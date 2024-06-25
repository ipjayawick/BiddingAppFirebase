import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqv2Gz54PHkXgV5QunIX6JXySmzv0zx24",
  authDomain: "biddingapp-2e25b.firebaseapp.com",
  projectId: "biddingapp-2e25b",
  storageBucket: "biddingapp-2e25b.appspot.com",
  messagingSenderId: "499684047618",
  appId: "1:499684047618:web:d2ce182edff66277d5a01b",
  measurementId: "G-1W0SCHEN5E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const functions = getFunctions(app);
// connectFunctionsEmulator(functions, "127.0.0.1", 5001); 
export const db = getFirestore(app);
// connectFirestoreEmulator(db, '127.0.0.1', 8080);
export const auth = getAuth(app)
// connectAuthEmulator(auth, "http://127.0.0.1:9099");
export const googleProvider = new GoogleAuthProvider();