import React, { useContext } from 'react';
import { getAuth } from "firebase/auth";
import Button from '@mui/material/Button';
import { AuthContext } from '../../context/AuthContext';
import { Box, Typography, Container } from '@mui/material';

const GoogleSignIn = () => {
  const { user, loading } = useContext(AuthContext)

  const viewCurrentUser = () => {
    console.log(getAuth().currentUser)
  }

  const showUser = () => {
    console.log(window.location.pathname)
    console.log(user)
    console.log(loading)
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          backgroundImage: `url(${"https://exmo.uom.lk/wp-content/uploads/2023/07/IMG_20220429_133352.jpg"})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h2" component="h1" gutterBottom>
              Bidding App
            </Typography>
            <Typography variant="h5" component="h2">
              Login to continue
            </Typography>
          </Box>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
          }}
        />
      </Box>
      <Button variant="contained" onClick={viewCurrentUser}>view user</Button>
      <Button variant="contained" onClick={showUser}>Show user</Button>
    </>
  );
};

export default GoogleSignIn;
