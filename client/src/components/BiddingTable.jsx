import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { db } from '../config/firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, setDoc } from 'firebase/firestore';
import { Button, Stack, TextField } from '@mui/material';

import Switch from '../components/Switch'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
function createData(companyId, companyName, description, totalVacancies, remainingVacancies, biddingPoints, bidders) {
  return {
    companyId,
    companyName,
    description,
    totalVacancies,
    remainingVacancies,
    biddingPoints,
    bidders
  };
}

function Row({ row,updateActiveRowId, enabled, isAdmin, isBiddingActive, addActiveCompanyBidders }) {
  const [open, setOpen] = useState(false);

  const handleChange = () => {
    if (enabled) {
      updateActiveRowId(null)
    } else {
      updateActiveRowId(row.companyId)
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: enabled ? "lightgreen" : "null" }}>
        {isAdmin && (
          <>
            <TableCell sx={{ pr: 0 }}>
              <Switch handleChange={handleChange} enabled={enabled} />
            </TableCell>
            <TableCell sx={{ pr: 0.5 }}>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          </>
        )}
        <TableCell component="th" scope="row">
          {row.companyName}
        </TableCell>
        <TableCell align="right">{row.description}</TableCell>
        <TableCell align="right">{row.totalVacancies}</TableCell>
        <TableCell align="right">{row.remainingVacancies}</TableCell>
        <TableCell align="right">{row.biddingPoints}</TableCell>
        <TableCell align="right">  <Button variant="contained" disabled={!enabled || isAdmin || !isBiddingActive} color="primary" onClick={() => {addActiveCompanyBidders() }}>Bid</Button></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {isAdmin && (
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Bidders
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.bidders && Object.keys(row.bidders).map((userId) => (
                      <TableRow key={userId}>
                        <TableCell component="th" scope="row">
                          {row.bidders[userId].userName}
                        </TableCell>
                        <TableCell>{row.bidders[userId].userId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function BiddingTable({addActiveCompanyBidders }) {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [activeRowId, setActiveRowId] = useState('')
  const [loading, setLoading] = useState(true)
  const [isBiddingActive, setIsBiddingActive] = useState(false)
  const { user: authUser } = useContext(AuthContext)

  useEffect(() => {
    const q = query(collection(db, "companies"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedCompanies = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = createData(doc.id, data.companyName, data.description, data.totalVacancies, data.remainingVacancies, data.biddingMargin, data.bidders);
        updatedCompanies.push(row);
      });
      setRows(updatedCompanies);
      setLoading(false)
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "controlData", "activeCompany"), (doc) => {
      const activeRowId = doc.data().activeCompanyId
      setIsBiddingActive(doc.data().isBiddingActive)
      setActiveRowId(activeRowId)

    });
    return () => unsubscribe();
  }, []);

  const updateActiveRowId = async (companyId) => {
    try {
      let companyRef = null
      if (companyId) {
        companyRef = doc(db, 'companies', companyId)
      }
      await setDoc(doc(db, "controlData", "activeCompany"), {
        activeCompanyId: companyId,
        companyRef,
        isBiddingActive: false
      });
    } catch (error) {
      console.error('Error updating control data:', error);
    }
  }

  if (!loading) {
    return (
      <Box display="flex" flexDirection="column">
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4">Companies</Typography>
          <TextField id="standard-basic" label="Search Company" variant="standard" onChange={(e) => { setSearch(e.target.value) }} />
        </Stack>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                {authUser.isAdmin && (
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
              {rows.
                filter((row) => search.toLowerCase() === '' ? true : row.companyName.toLowerCase().startsWith(search)).
                map((row) => (
                  <Row key={row.companyId} row={row} updateActiveRowId={updateActiveRowId} enabled={activeRowId === row.companyId} isAdmin={authUser.isAdmin} isBiddingActive={isBiddingActive} addActiveCompanyBidders={addActiveCompanyBidders} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box >
    );
  } else {
    <>
      Loading...
    </>

  }
}
