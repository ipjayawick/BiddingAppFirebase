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
import { arrayRemove, collection, deleteDoc, doc, increment, onSnapshot, query, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Stack, TextField, Typography, Button } from '@mui/material';
import UpdateCompany from './UpdateCompany';
import AddCompany from './AddCompany';

function Row({ company, deleteCompany, removeBidderFromCompany }) {
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
                    {company.companyName}
                </TableCell>
                <TableCell align="right">{company.description}</TableCell>
                <TableCell align="right">{company.totalVacancies}</TableCell>
                <TableCell align="right">{company.remainingVacancies}</TableCell>
                <TableCell align="right">{company.biddingMargin}</TableCell>
                <TableCell align="right">
                    <UpdateCompany companyData={company} />
                </TableCell>
                <TableCell align="right">
                    <Button variant="contained" color="error" onClick={() => deleteCompany(company.companyId)}>Delete</Button>
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
                                    {company.bidders && company.bidders.map((bidder, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {bidder.userName}
                                            </TableCell>
                                            <TableCell>{bidder.userId}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="error" onClick={() => removeBidderFromCompany(company, bidder.userId)}>Remove</Button>
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
    const [companies, setCompanies] = useState([])
    const [search, setSearch] = useState('')

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, "companies"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const companyArr = snapshot.docs.map(doc => ({ companyId: doc.id, ...doc.data(), }))
            setCompanies(companyArr)
            setLoading(false)
        });

        return () => unsubscribe();
    }, []);

    const deleteCompany = async (companyId) => {
        try {
            await deleteDoc(doc(db, "companies", companyId));
        } catch (error) {
            console.error('Error Deleting company :', error);
        }
    }

    const removeBidderFromCompany = async (company, userId) => {
        try {
            const batch = writeBatch(db);

            batch.update(doc(db, "companies", company.companyId), {
                bidders: arrayRemove(...company.bidders.filter(bidder => bidder.userId == userId)),
                remainingVacancies: increment(1)
            })

            batch.update(doc(db, 'users', userId), {
                companies: arrayRemove(company.companyName),
                remainingBiddingPoints: increment(company.biddingMargin)
            })

            await batch.commit();
        } catch (error) {
            console.error('Error removing bidder from company:', error)
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
                            <TableCell align="right">Bidding Margin</TableCell>
                            <TableCell align="right">Update</TableCell>
                            <TableCell align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.
                            filter((company) => search.toLowerCase() === '' ? true : company.companyName.toLowerCase().startsWith(search)).
                            map((company) => (
                                <Row key={company.companyId} company={company} deleteCompany={deleteCompany} removeBidderFromCompany={removeBidderFromCompany} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );

}