import React, { useContext } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from "../config/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import Button from '@mui/material/Button';
import { AuthContext } from '../context/AuthContext';


const GoogleSignIn = () => {
  const {user,loading}=useContext(AuthContext)
  
  
  const functions = getFunctions();
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  const addMessage = httpsCallable(functions, 'addMessage');
  const messageText = "hello"
  
  const showUser=()=>{
    console.log(user)
    console.log(loading)
  }
  
  const sendAddMessage = () => {
    addMessage({ text: messageText })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        const sanitizedMessage = data.text;
        console.log(sanitizedMessage + "resoponse")
      });
  }
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
  const viewCurrentUser = () => {
    console.log(getAuth().currentUser)
  }

  return (
    <>
      <Button variant="contained" onClick={handleLogin}>Login with Google</Button>
      <Button variant="contained" onClick={viewCurrentUser}>view user</Button>
      <Button variant="contained" onClick={sendAddMessage}>send message</Button>
      <Button variant="contained" onClick={showUser}>Show user</Button>
    </>
  );
};

export default GoogleSignIn;
