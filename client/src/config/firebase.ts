import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getFunctions } from 'firebase/functions';

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
const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();