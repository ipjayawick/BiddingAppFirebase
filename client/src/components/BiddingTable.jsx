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
import { Button } from '@mui/material';

function createData(companyId, companyName, description, totalVacancies, remainingVancies, biddingPoints, userName, userId) {
  return {
    companyId,
    companyName,
    description,
    totalVacancies,
    remainingVancies,
    biddingPoints,
    bidders: [
      {
        userName: 'isuru',
        userId: '200',
      },
      {
        userName: 'malith',
        userId: '300',
      },
    ],
  };
}

function Row({ row }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
        <TableCell align="right">{row.remainingVancies}</TableCell>
        <TableCell align="right">{row.biddingPoints}</TableCell>
        <TableCell align="right">  <Button variant="contained" color="primary">Bid</Button></TableCell>
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
                  {row.bidders.map((biddersRow) => (
                    <TableRow key={biddersRow.userId}>
                      <TableCell component="th" scope="row">
                        {biddersRow.userName}
                      </TableCell>
                      <TableCell>{biddersRow.userId}</TableCell>
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

export default function BiddingTable() {
  const [rows, setRows] = useState([])
  useEffect(() => {
    const q = query(collection(db, "companies"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedCompanies = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = createData(doc.id, data.name, data.description, data.totalVacancies, data.remainingVacancies, data.biddingMargin, "isuru", "200");
        updatedCompanies.push(row);
      });
      setRows(updatedCompanies);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);


  return (
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
          {rows.map((row) => (
            <Row key={row.companyId} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
