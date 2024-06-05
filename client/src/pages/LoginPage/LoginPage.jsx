import React, { useContext } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import Button from '@mui/material/Button';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'

const GoogleSignIn = () => {
  const { user, loading, googleSignIn, googleSignOut } = useContext(AuthContext)
  const navigate = useNavigate()

  const functions = getFunctions();
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  const addMessage = httpsCallable(functions, 'addMessage');
  const messageText = "hello"

  const showUser = () => {
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
  
  const handleLogin = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error)
    }
    navigate('/biddingPage')

  };

  const handleLogOut = async () => {
    try {
      await googleSignOut()
    } catch (error) {
      console.log(error)
    }
    console.log(user)
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
      <Button variant="contained" onClick={handleLogOut}>Logout</Button>
    </>
  );
};

export default GoogleSignIn;
