import React, { } from 'react'
import { db } from '../../config/firebase';
import { updateDoc, doc, increment, arrayUnion } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Container } from '@mui/material';
import UserCard from '../../components/UserCard'
import Grid from '@mui/material/Grid';
import BiddingTable from '../../components/BiddingTable'

const BiddingPage = () => {
  const { user } = useContext(AuthContext)

  const updateUser = async (companyData) => {
    const userRef = doc(db, "users", user.userId)
    await updateDoc(userRef, {
      remainingBiddingPoints: increment(-companyData.biddingPoints),
      companies: arrayUnion(companyData.companyName)
    })
  }

  const updateCompany = async (companyId) => {
    const companyRef = doc(db, "companies", companyId)
    await updateDoc(companyRef, {
      [`bidders.${user.userId}`]: {
        userId: user.userId,
        userName: user.displayName
      },
      remainingVacancies: increment(-1),
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