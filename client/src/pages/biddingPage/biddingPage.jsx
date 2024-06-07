import React, { useRef, useState } from 'react'
import Button from '@mui/material/Button';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, increment, arrayUnion } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Container, TextField, Typography } from '@mui/material';
import UserCard from '../../components/UserCard'
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import BiddingTable from '../../components/BiddingTable'

const BiddingPage = ({ companyId }) => {
  const [bidStatus, setBidStatus] = useState('');
  const { user } = useContext(AuthContext)

  const updateUser = async (companyName) => {
    const userRef = doc(db, "users", user.uid)
    await updateDoc(userRef, {
      remainingBiddingPoints: increment(-10),
      companies: arrayUnion(companyName)
    })
  }

  const updateCompany = async (companyId) => {
    const companyRef = doc(db, "companies", companyId)
    await updateDoc(companyRef, {
      remainingVacancies: increment(-1),
      bidders: arrayUnion({
        userId: user.uid,
        userName: user.displayName
      })
    })
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <BiddingTable updateCompany={updateCompany} updateUser={updateUser} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <UserCard />
        </Grid>
      </Grid>
    </Container>
  )
}

export default BiddingPage