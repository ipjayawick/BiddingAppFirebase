import React, { useState } from 'react'
import { db } from '../../config/firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Container } from '@mui/material';
import UserCard from '../../components/UserCard'
import Grid from '@mui/material/Grid';
import BiddingTable from '../../components/BiddingTable'
import BiddingInfoCard from '../../components/BiddingInfoCard'
import { useEffect } from 'react';

const BiddingPage = () => {
  const { user } = useContext(AuthContext)
  const [activeCompanyData, setActiveCompanyData] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "controlData", "activeCompany"), (doc) => {
      setActiveCompanyData(doc.data())
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, "users", user.userId), (doc) => {
        setUserData(doc.data());
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <Container sx={{ mt: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          {activeCompanyData && userData && (
            <BiddingTable activeCompanyData={activeCompanyData} userData={userData} />
          )}
        </Grid>
        <Grid item xs={12} sm={4}>
          {user?.isAdmin ? (
            <BiddingInfoCard activeCompanyData={activeCompanyData} />
          ) : (
            <UserCard userData={userData} />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default BiddingPage