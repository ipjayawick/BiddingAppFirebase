import React, { useRef, useState } from 'react'
import Button from '@mui/material/Button';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, increment } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Container, Typography } from '@mui/material';
import UserCard from '../../components/UserCard'
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import BiddingTable from '../../components/BiddingTable'

const BiddingPage = ({ companyId }) => {
  const [bidStatus, setBidStatus] = useState('');
  const { user } = useContext(AuthContext)

  const updateUser = async () => {
    const userRef = doc(db, "users", user.uid)
    await updateDoc(userRef, {
      remainingBiddingPoints: increment(-10)
    })
  }

  const updateCompany = async () => {
    const companyRef = doc(db, "companies", "7m7Qe6IZbbiIDu9UN5jY")
    await updateDoc(companyRef, {
      remainingVacancies: increment(-1)
    })
  }
  const handleBid = async () => {
    await updateUser()
    await updateCompany()
    // setBidStatus('Bid placed for Company A');
    // console.log('Bid placed for Company A');

    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });

    // try {
    //   const docRef = await addDoc(collection(db, "users"), {
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
  };


  return (
    <Container sx={{ mt: 10}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <BiddingTable />
            {/* <Typography variant="h5" style={{ marginBottom: '0.5em' }}>Company A</Typography>
            <Button variant="contained" onClick={handleBid} style={{ width: '100%' }}>Bid</Button> */}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <UserCard />
        </Grid>
      </Grid>
    </Container>
  )
}

export default BiddingPage