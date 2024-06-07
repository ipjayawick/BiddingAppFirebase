import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Stack, TextField, Typography,Button } from '@mui/material';

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

export default function CompnayTable() {

    const [rows, setRows] = useState([])
    const [search, setSearch] = useState('')

    console.log(search)
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
                <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right">Total Vacancies</TableCell>
                                <TableCell align="right">Remaining Vancies</TableCell>
                                <TableCell align="right">Bidding Points</TableCell>
                                <TableCell align="right">Update</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.
                                filter((row) => search.toLowerCase() === '' ? true : row.companyName.toLowerCase().includes(search)).
                                map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell component="th" scope="row">{row.companyName}</TableCell>
                                            <TableCell align="right">{row.description}</TableCell>
                                            <TableCell align="right">{row.totalVacancies}</TableCell>
                                            <TableCell align="right">{row.remainingVacancies}</TableCell>
                                            <TableCell align="right">{row.biddingPoints}</TableCell>
                                            <TableCell align="right">  <Button variant="contained" color="primary" onClick={() => { updateCompany(row.companyId); updateUser(row.companyName); }}>Update</Button></TableCell>
                                            <TableCell align="right">  <Button variant="contained" color="error" onClick={() => { updateCompany(row.companyId); updateUser(row.companyName); }}>Delete</Button></TableCell>
                                        </TableRow>
                                    );
                                })}
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