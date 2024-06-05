import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { db } from '../../config/firebase';
import { collection, addDoc,getDocs } from "firebase/firestore";

const BiddingPage = () => {
  const [bidStatus, setBidStatus] = useState('');

  const handleBid = async () => {
    setBidStatus('Bid placed for Company A');
    console.log('Bid placed for Company A');

    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });

    try {
      const docRef = await addDoc(collection(db, "user"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  };

  return (
    <>
      <div>Company A</div>
      <Button variant="contained" onClick={handleBid}>Bid</Button>
    </>
  )
}

export default BiddingPage