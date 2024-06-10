import * as React from 'react';
import PropTypes from 'prop-types';
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
import { getDocs, collection, query, onSnapshot } from 'firebase/firestore';
import { Button, Checkbox, Radio, Stack, TextField } from '@mui/material';

import Switch from '../components/Switch'
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

function Row({ row, updateCompany, updateUser, setActiveRowId, enabled }) {
  const [open, setOpen] = useState(false);

  const handleChange = () => {
    if (enabled) {
      setActiveRowId(null)
    } else {
      setActiveRowId(row.companyId)
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: enabled ? "lightgreen" : "null" }}>
        <TableCell>
          <Switch handleChange={handleChange} enabled={enabled} />
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.companyName}
        </TableCell>
        <TableCell align="right">{row.description}</TableCell>
        <TableCell align="right">{row.totalVacancies}</TableCell>
        <TableCell align="right">{row.remainingVacancies}</TableCell>
        <TableCell align="right">{row.biddingPoints}</TableCell>
        <TableCell align="right">  <Button variant="contained" color="primary" onClick={() => { updateCompany(row.companyId); updateUser(row); }}>Bid</Button></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
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
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function BiddingTable({ updateCompany, updateUser }) {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [activeRowId, setActiveRowId] = useState('')

  const [loading, setLoading] = useState(true)
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

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

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
                <TableCell />
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
                filter((row) => search.toLowerCase() === '' ? true : row.companyName.toLowerCase().includes(search)).
                map((row) => (
                  <Row key={row.companyId} row={row} updateCompany={updateCompany} updateUser={updateUser} setActiveRowId={setActiveRowId} enabled={activeRowId === row.companyId} />
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
