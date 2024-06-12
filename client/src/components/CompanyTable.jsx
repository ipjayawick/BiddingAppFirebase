import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import { useEffect } from 'react';
import { arrayRemove, collection, deleteDoc, deleteField, doc, increment, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Stack, TextField, Typography, Button } from '@mui/material';
import UpdateCompany from './UpdateCompany';
import AddCompany from './AddCompany';
function createData(companyId, companyName, description, totalVacancies, remainingVacancies, biddingMargin, bidders) {
    return {
        companyId,
        companyName,
        description,
        totalVacancies,
        remainingVacancies,
        biddingMargin,
        bidders
    };
}

function Row({ row, deleteCompany, removeBidderFromCompany }) {
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
                <TableCell align="right">{row.remainingVacancies}</TableCell>
                <TableCell align="right">{row.biddingMargin}</TableCell>
                <TableCell align="right">
                    <UpdateCompany companyData={row} />
                </TableCell>
                <TableCell align="right">
                    <Button variant="contained" color="error" onClick={() => deleteCompany(row.companyId)}>Delete</Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Users
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Remove</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.bidders && Object.keys(row.bidders).map((bidder,index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {row.bidders[bidder].userName}
                                            </TableCell>
                                            <TableCell>{row.bidders[bidder].userId}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="error" onClick={() => removeBidderFromCompany(row.companyId, row.bidders[bidder].userId, row.companyName,row.biddingMargin)}>Remove</Button>
                                            </TableCell>
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

export default function CompnayTable() {
    const [rows, setRows] = useState([])
    const [search, setSearch] = useState('')

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

    const deleteCompany = async (companyId) => {
        try {
            await deleteDoc(doc(db, "companies", companyId));
        } catch (error) {
            console.error('Error Deleting company :', error);
        }
    }

    const removeBidderFromCompany = async (companyId, userId, companyName,biddingMargin) => {
        try {
            await updateDoc(doc(db, "companies", companyId), {
                [`bidders.${userId}`]: deleteField()
            })
            await updateDoc(doc(db, 'users', userId), {
                companies: arrayRemove(companyName),
                remainingBiddingPoints:increment(biddingMargin)
            })
        } catch (error) {
            console.error('Error deleting bidder from company:', error)
        }
    }

    if (loading) {
        return (<>
            Loading...
        </>)
    }
    return (
        <Box display="flex" flexDirection="column">
            <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4">Companies</Typography>
                <Stack direction="row" alignItems="baseline">
                    <AddCompany />
                    <TextField sx={{ ml: 2 }} id="standard-basic" label="Search Company" variant="standard" onChange={(e) => { setSearch(e.target.value) }} />
                </Stack>
            </Stack>
            <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
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
                            filter((row) => search.toLowerCase() === '' ? true : row.companyName.toLowerCase().startsWith(search)).
                            map((row) => (
                                <Row key={row.companyId} row={row} deleteCompany={deleteCompany} removeBidderFromCompany={removeBidderFromCompany} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );

}