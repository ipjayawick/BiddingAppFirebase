import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { db } from '../config/firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Stack, TextField } from '@mui/material';
import PopupAlert from '../components/PopupAlert'
import Row from '../components/BiddingTableRow'

export default function BiddingTable({ activeCompanyData, userData }) {
  const [companies, setCompanies] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [alertOpen, setAlertOpen] = useState(false)

  useEffect(() => {
    const q = query(collection(db, "companies"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedCompanies = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedCompanies.push({ ...data, companyId: doc.id });
      });
      setCompanies(updatedCompanies);
      setLoading(false)
    });
    return () => unsubscribe();
  }, []);

  const addActiveCompanyBidders = async () => {
    const bidderObj = {
      userId: userData.userId,
      userName: userData.userName,
      userRef: doc(db, "users", userData.userId)
    }

    await updateDoc(doc(db, "controlData", "activeCompany"), {
      bidders: arrayUnion(bidderObj)
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

  //error, warning, info, success
  if (!loading) {
    return (
      <>
        <PopupAlert text={"Not enough bidding points"} type={"warning"} alertOpen={alertOpen} handleClose={handleClose} />
        <Box display="flex" flexDirection="column">
          <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h4">Companies</Typography>
            <TextField id="standard-basic" label="Search Company" variant="standard" onChange={(e) => { setSearch(e.target.value) }} />
          </Stack>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  {userData.isAdmin && (
                    <>
                      <TableCell />
                      <TableCell />
                    </>
                  )}
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Total Vacancies</TableCell>
                  <TableCell align="right">Remaining Vancies</TableCell>
                  <TableCell align="right">Bidding Points</TableCell>
                  <TableCell align="right">Bid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.
                  filter((company) => search.toLowerCase() === '' ? true : company.companyName.toLowerCase().startsWith(search)).
                  map((company) => (
                    <Row key={company.companyId} addActiveCompanyBidders={addActiveCompanyBidders} setAlertOpen={setAlertOpen} company={company} activeCompanyData={activeCompanyData} userData={userData}/>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box >
      </>
    );
  } else {
    <>
      Loading...
    </>

  }
}
