import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import Switch from '../components/Switch'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Row({ addActiveCompanyBidders, setAlertOpen, company, activeCompanyData }) {
    const [open, setOpen] = useState(false);
    const { user: authUser } = useContext(AuthContext)
    const [bidButtonState, setBidButtonState] = useState(false)
    const [isRowEnabled, setIsRowEnabled] = useState(false)

    useEffect(() => {
        console.log(activeCompanyData);
        setIsRowEnabled(activeCompanyData.activeCompanyId === company.companyId);
    }, [activeCompanyData, company]);

    useEffect(() => {
        setBidButtonState(isRowEnabled && !authUser.isAdmin && activeCompanyData?.isBiddingActive && !authUser.companies.includes(company.companyName));
    }, [isRowEnabled, authUser, activeCompanyData]);

    const handleEnableSwitchToggle = () => {
        if (isRowEnabled) {
            updateActiveRowId(null)
        } else {
            updateActiveRowId(company.companyId)
        }
    };

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

    const handleBid = () => {
        if (company.biddingMargin < authUser.remainingBiddingPoints) {
            try {
                addActiveCompanyBidders()
                setBidButtonState(false)
            } catch (error) {
                console.log(error)
            }
        } else {
            setAlertOpen(true)
        }
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: isRowEnabled ? "lightgreen" : "null" }}>
                {authUser.isAdmin && (
                    <>
                        <TableCell sx={{ pr: 0 }}>
                            <Switch handleChange={handleEnableSwitchToggle} enabled={isRowEnabled} />
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
                    {company.companyName}
                </TableCell>
                <TableCell align="right">{company.description}</TableCell>
                <TableCell align="right">{company.totalVacancies}</TableCell>
                <TableCell align="right">{company.remainingVacancies}</TableCell>
                <TableCell align="right">{company.biddingMargin}</TableCell>
                <TableCell align="right">  <Button variant="contained" disabled={!bidButtonState} color="primary" onClick={handleBid}>Bid</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {authUser.isAdmin && (
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
                                        {company.bidders && Object.keys(company.bidders).map((userId) => (
                                            <TableRow key={userId}>
                                                <TableCell component="th" scope="row">
                                                    {company.bidders[userId].userName}
                                                </TableCell>
                                                <TableCell>{company.bidders[userId].userId}</TableCell>
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