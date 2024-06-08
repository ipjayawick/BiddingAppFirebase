import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { getDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from "../config/firebase";

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          // setUser({ ...firebaseUser, ...userDoc.data() });
          setUser(userDoc.data());
        } else {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            userId: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            initialBiddingPoints: 100,
            remainingBiddingPoints: 100,
            createdAt: new Date(),
          });
          setUser(userDoc.data());
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const googleSignIn = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      console.log('User:', result.user);
      console.log('Token:', credential.accessToken);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error('Error:', errorCode, errorMessage, email, credential);
    }
    setLoading(false);
  }

  const googleSignOut = async () => {
    setLoading(true);
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, googleSignIn, googleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
