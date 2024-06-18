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
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Stack, TextField } from '@mui/material';
import UpdateUser from './UpdateUser';


function Row({ user }) {
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
                    {user.userName}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.initialBiddingPoints}</TableCell>
                <TableCell align="right">{user.remainingBiddingPoints}</TableCell>
                <TableCell align="right">  <UpdateUser userData={user} /></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Companies
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                {/* <TableHead>
                                    <TableRow>
                                        <TableCell>Company</TableCell>
                                        <TableCell>ID</TableCell>
                                    </TableRow>
                                </TableHead> */}
                                <TableBody>
                                    {user.companies?.map((company, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {company}
                                            </TableCell>
                                            {/* <TableCell>{"companiesRow.companyId"}</TableCell> */}
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

export default function UserTable({ updateUser }) {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userArr = snapshot.docs.map(doc => doc.data())
            setUsers(userArr)
            setLoading(false)
        });
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    if (!loading) {
        return (
            <Box display="flex" flexDirection="column">
                <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h4">Users</Typography>
                    <TextField id="standard-basic" label="Search User" variant="standard" onChange={(e) => { setSearch(e.target.value) }} />
                </Stack>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>User</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="right">Initial Bidding Points</TableCell>
                                <TableCell align="right">Remaining Bidding Points</TableCell>
                                <TableCell align="right">Update</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.
                                filter((user) => search.toLowerCase() === '' ? true : user.userName.toLowerCase().startsWith(search)).
                                map((user, index) => (
                                    <Row key={index} user={user} updateUser={updateUser} />
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
