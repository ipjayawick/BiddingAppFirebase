import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import { arrayRemove, arrayUnion, collection, doc, getDocs, increment, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../config/firebase';
import UpdateBiddingMarginDialog from '../components/UpdateBiddingMarginDialog'
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();
const handleSubmission = httpsCallable(functions, 'handleBidSubmission');

export default function OutlinedCard({ activeCompanyData }) {
    const [activeCompany, setActiveCompany] = useState(null)

    useEffect(() => {
        if (!activeCompanyData?.activeCompanyId) return
        const unsubscribe = onSnapshot(doc(db, "companies", activeCompanyData.activeCompanyId), async (doc) => {
            setActiveCompany(doc.data())
        });
        return () => unsubscribe();
    }, [activeCompanyData])

    const updateteBiddingStatus = async (isBiddingActive) => {
        await updateDoc(doc(db, "controlData", "activeCompany"), {
            isBiddingActive
        })
    };

    const removeLiveBidder = async (userId) => {
        try {
            await updateDoc(doc(db, "controlData", "activeCompany"), {
                bidders: arrayRemove(...activeCompanyData.bidders.filter(bidder => bidder.userId == userId))
            })
        } catch (error) {
            console.error('Error deleting bidder from company:', error)
        }
    }

    const changeBiddingMargin = async (value) => {
        await updateDoc(doc(db, 'companies', activeCompanyData.activeCompanyId), {
            biddingMargin: value
        })

        await updateDoc(doc(db, "controlData", "activeCompany"), {
            bidders: []
        })
    }

    const handleBidSubmission = async () => {
        if (!activeCompanyData.bidders) return

        try {
            const res = await handleSubmission()
        } catch (error) {
            console.error('Error submitting the bid: ', error);
        }
    }

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    if (activeCompany === null || activeCompanyData.activeCompanyId === null) {
        return (
            <>
                <Typography variant="h4" mb={2.5}>Active Company</Typography>
                Select a Company
            </>
        )
    }

    return (
        <>
            <UpdateBiddingMarginDialog handleClose={handleClose} open={open} currentMargin={activeCompany.biddingMargin} changeBiddingMargin={changeBiddingMargin} />
            <Typography variant="h4" mb={2.5}>Active Company</Typography>
            <Card variant="outlined" sx={{ maxWidth: 360 }}>
                <Box sx={{ p: 2, pb: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" >
                        <Typography fontSize={18} component="div">
                            {activeCompany?.companyName}
                        </Typography>

                        <Button
                            variant="contained"
                            color={activeCompanyData.isBiddingActive ? "error" : "success"}
                            onClick={() => updateteBiddingStatus(!activeCompanyData.isBiddingActive)}
                        >
                            {activeCompanyData.isBiddingActive ? "Stop Bidding" : "Start Bidding"}
                        </Button>
                    </Stack>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <>
                    <Box sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom fontSize={18} component="div" mb={0}>
                                Bidding Margin
                            </Typography>
                            <Button variant="contained" disabled={activeCompanyData.isBiddingActive ? true : false} color="primary" sx={{ marginLeft: "auto", marginRight: 2 }} onClick={handleClickOpen}>Change</Button>
                            <Typography gutterBottom fontSize={18} component="div" mb={0}>
                                {activeCompany?.biddingMargin}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, backgroundColor: (activeCompanyData.bidders && (activeCompany.remainingVacancies < activeCompanyData.bidders.length)) && "#FF6865" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom fontSize={18} component="div" mb={0} >
                                Vacancies Available
                            </Typography>
                            <Typography gutterBottom fontSize={18} component="div" mb={0}>
                                {activeCompany?.remainingVacancies}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom fontSize={18} component="div" >
                                Live Bidders
                            </Typography>
                            <Typography gutterBottom fontSize={18} component="div">
                                {activeCompanyData.bidders ? activeCompanyData.bidders.length : null}
                            </Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <List sx={{ pt: 0 }}>
                                {activeCompanyData.bidders && activeCompanyData.bidders.map((bidder, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem sx={{ py: 0, pt: 1 }}>
                                            <ListItemText primary={bidder.userName} />
                                            <Button variant="contained" disabled={activeCompanyData.isBiddingActive ? true : false} color="error" size='small' onClick={() => removeLiveBidder(bidder.userId)}>Remove</Button>
                                        </ListItem>
                                        <Divider variant="middle" component="li" />
                                    </React.Fragment>
                                )
                                )}
                            </List>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">

                            <Button variant="contained" disabled={activeCompanyData.isBiddingActive || !activeCompanyData.bidders || activeCompany.remainingVacancies < activeCompanyData.bidders.length ? true : false} color="primary" sx={{ marginLeft: "auto", marginRight: 2, width: '100%' }} onClick={handleBidSubmission}>Submit</Button>

                        </Stack>
                    </Box>
                </>
            </Card >
        </>
    );
}
