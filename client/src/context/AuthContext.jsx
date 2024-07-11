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

  useEffect(() => console.log(user, loading, "-----"), [user, loading])
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        console.log(firebaseUser, 'firebaes user')
        const userExists = await fetchUserDocument(firebaseUser.uid);
        if (!userExists) {
          waitForUserDocument(firebaseUser.uid);
        }
      } else {
        console.log('no user')
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  
  const fetchUserDocument = async (uid) => {
    console.log('hettting')
    const userDoc = await getDoc(doc(db, 'users', uid));
    console.log('hetttinwwwg')
    console.log(userDoc, 'doc-0-----')
    if (userDoc.exists()) {
      setUser(userDoc.data());
      setLoading(false);
      return true;
    }
    return false;
  };

  const waitForUserDocument = async (uid) => {
    let attempts = 0;
    const maxAttempts = 5;
    const delay = 1000; // 1 second

    while (attempts < maxAttempts) {
      const userExists = await fetchUserDocument(uid);
      if (userExists) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }
    setLoading(false); // Handle case where document was not created within the expected time
  };

  const googleSignIn = async () => {
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
