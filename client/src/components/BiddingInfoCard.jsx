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
import { arrayRemove, deleteField, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../config/firebase';

export default function OutlinedCard() {
    const [activeCompany, setActiveCompany] = useState(null)
    const [isBiddingActive, setIsBiddingActive] = useState(false);
    const [activeCompanyId, setActiveCompanyId] = useState(null)
    const [updateCount, setUpdateCount] = useState(0);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "controlData", "activeCompany"), async (doc) => {
            const companyRef = (doc.data().companyRef)
            if (companyRef) {
                const data = await getDoc(companyRef)
                setActiveCompany(data.data())
                setActiveCompanyId(doc.data().activeCompanyId)
            } else {
                setActiveCompany(null)
            }
            setIsBiddingActive(doc.data().isBiddingActive)
        });
        return () => unsubscribe();
    }, [updateCount]);

    const updateteBiddingStatus = async (isBiddingActive) => {
        await updateDoc(doc(db, "controlData", "activeCompany"), {
            isBiddingActive
        })
    };

    const removeBidderFromCompany = async (userId) => {
        try {
            await updateDoc(doc(db, "companies", activeCompanyId), {
                [`bidders.${userId}`]: deleteField()
            })
            await updateDoc(doc(db, 'users', userId), {
                companies: arrayRemove(activeCompany.companyName),
                remainingBiddingPoints: increment(activeCompany.biddingMargin)
            })
            setUpdateCount(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting bidder from company:', error)
        }
    }

    if (activeCompany === null) {
        return (
            <>
                <Typography variant="h4" mb={2.5}>Active Company</Typography>
                Select a Company
            </>
        )
    }

    return (
        <>
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
                            <Button variant="contained" color="primary" sx={{ marginLeft: "auto", marginRight: 2 }}>Change</Button>
                            <Typography gutterBottom fontSize={18} component="div" mb={0}>
                                {activeCompany?.biddingMargin}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, backgroundColor: (activeCompany.totalVacancies < Object.keys(activeCompany.bidders).length) && "#FF6865" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom fontSize={18} component="div" mb={0} >
                                Vacancies for Round
                            </Typography>
                            <Button variant="contained" color="primary" sx={{ marginLeft: "auto", marginRight: 2 }}>Change</Button>
                            <Typography gutterBottom fontSize={18} component="div" mb={0}>
                                {activeCompany?.totalVacancies}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom fontSize={18} component="div" >
                                Bidders
                            </Typography>
                            <Typography gutterBottom fontSize={18} component="div">
                                {activeCompany?.bidders ? Object.keys(activeCompany.bidders).length : null}
                            </Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <List sx={{ pt: 0 }}>
                                {activeCompany?.bidders && Object.keys(activeCompany.bidders).map((bidder, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem sx={{ py: 0, pt: 1 }}>
                                            <ListItemText primary={activeCompany.bidders[bidder].userName} />
                                            <Button variant="contained" color="error" size='small' onClick={() => removeBidderFromCompany(activeCompany.bidders[bidder].userId)}>Remove</Button>
                                        </ListItem>
                                        <Divider variant="middle" component="li" />
                                    </React.Fragment>
                                )
                                )}
                            </List>
                        </Stack>
                    </Box>
                </>
            </Card >
        </>
    );
}
