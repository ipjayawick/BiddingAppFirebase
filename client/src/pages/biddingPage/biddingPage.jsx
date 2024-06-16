import React, { useState } from 'react'
import { db } from '../../config/firebase';
import { updateDoc, doc, increment, arrayUnion, setDoc } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Container } from '@mui/material';
import UserCard from '../../components/UserCard'
import Grid from '@mui/material/Grid';
import BiddingTable from '../../components/BiddingTable'
import BiddingInfoCard from '../../components/BiddingInfoCard'

const BiddingPage = () => {
  const { user } = useContext(AuthContext)


  const addActiveCompanyBidders = async () => {
    const bidderObj = {
      userId: user.userId,
      userName: user.displayName,
      userRef: doc(db, "users", user.userId)
    }
    await updateDoc(doc(db, "controlData", "activeCompany"), {
      [`bidders.${user.userId}`]: bidderObj
    })
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <BiddingTable addActiveCompanyBidders={addActiveCompanyBidders} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {user?.isAdmin ? (
            <BiddingInfoCard />
          ) : (
            <UserCard />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default BiddingPage