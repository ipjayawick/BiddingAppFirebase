import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import { arrayRemove, arrayUnion, collection, deleteField, doc, getDoc, getDocs, increment, onSnapshot, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../config/firebase';
import UpdateBiddingMarginDialog from '../components/UpdateBiddingMarginDialog'

export default function OutlinedCard({ activeCompanyData }) {
    const [activeCompany, setActiveCompany] = useState(null)
    const [isBiddingActive, setIsBiddingActive] = useState(null);
    const [activeCompanyId, setActiveCompanyId] = useState(null)
    const [bidders, setBidders] = useState(null)

    useEffect(() => {
        setIsBiddingActive(activeCompanyData?.isBiddingActive);
        setActiveCompanyId(activeCompanyData?.activeCompanyId);
        setBidders(activeCompanyData?.bidders);
    }, [activeCompanyData]);

    useEffect(() => {
        if (!activeCompanyId) return
        const unsubscribe = onSnapshot(doc(db, "companies", activeCompanyId), async (doc) => {
            setActiveCompany(doc.data())
        });
        return () => unsubscribe();
    }, [activeCompanyData])

    const updateteBiddingStatus = async (isBiddingActive) => {
        await updateDoc(doc(db, "controlData", "activeCompany"), {
            isBiddingActive
        })
    };

    const removeBidderFromCompany = async (userId) => {
        try {
            await updateDoc(doc(db, "controlData", "activeCompany"), {
                [`bidders.${userId}`]: deleteField()
            })
        } catch (error) {
            console.error('Error deleting bidder from company:', error)
        }
    }

    const changeBiddingMargin = async (value) => {
        await updateDoc(doc(db, 'companies', activeCompanyId), {
            biddingMargin: value
        })

        await updateDoc(doc(db, "controlData", "activeCompany"), {
            bidders: deleteField()
        })
    }

    const handleBidSubmission = async () => {
        if (!bidders) return
        await updateDoc(doc(db, "companies", activeCompanyId), {
            bidders,
            remainingVacancies: increment(-Object.keys(bidders).length)
        })
        await updateDoc(doc(db, "controlData", "activeCompany"), {
            bidders: deleteField()
        })
        try {
            const batch = writeBatch(db);
            const querySnapshot = await getDocs(collection(db, 'users'));

            querySnapshot.forEach((docSnapshot) => {
                const docRef = doc(db, 'users', docSnapshot.id);
                batch.update(docRef, {
                    remainingBiddingPoints: increment(-activeCompany.biddingMargin),
                    'companies': arrayUnion(activeCompany.companyName)
                });
            });

            await batch.commit();
        } catch (error) {
            console.error('Error updating documents: ', error);
        }
    }

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    if (activeCompany === null || activeCompanyId === null) {
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
                            color={isBiddingActive ? "error" : "success"}
                            onClick={() => updateteBiddingStatus(!isBiddingActive)}
                        >
                            {isBiddingActive ? "Stop Bidding" : "Start Bidding"}
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
                            <Button variant="contained" disabled={isBiddingActive ? true : false} color="primary" sx={{ marginLeft: "auto", marginRight: 2 }} onClick={handleClickOpen}>Change</Button>
                            <Typography gutterBottom fontSize={18} component="div" mb={0}>
                                {activeCompany?.biddingMargin}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, backgroundColor: (bidders && (activeCompany.remainingVacancies < Object.keys(bidders).length)) && "#FF6865" }}>
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
                                {bidders ? Object.keys(bidders).length : null}
                            </Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <List sx={{ pt: 0 }}>
                                {bidders && Object.keys(bidders).map((bidder, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem sx={{ py: 0, pt: 1 }}>
                                            <ListItemText primary={bidders[bidder].userName} />
                                            <Button variant="contained" disabled={isBiddingActive ? true : false} color="error" size='small' onClick={() => removeBidderFromCompany(bidders[bidder].userId)}>Remove</Button>
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

                            <Button variant="contained" disabled={isBiddingActive || !bidders || activeCompany.remainingVacancies < Object.keys(bidders).length ? true : false} color="primary" sx={{ marginLeft: "auto", marginRight: 2, width: '100%' }} onClick={handleBidSubmission}>Submit</Button>

                        </Stack>
                    </Box>
                </>
            </Card >
        </>
    );
}
