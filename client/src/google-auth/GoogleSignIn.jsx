import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from "../config/firebase";

const GoogleSignIn = () => {
  const handleLogin = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log('User:', user);
        console.log('Token:', token);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Error:', errorCode, errorMessage, email, credential);
      });
  };
  const viewCurrentUser=()=>{
    console.log(getAuth().currentUser)
  }

  return (
    <>
    <button onClick={handleLogin}>Login with Google</button>
    <button onClick={viewCurrentUser}>view user</button>
    </>
  );
};

export default GoogleSignIn;
