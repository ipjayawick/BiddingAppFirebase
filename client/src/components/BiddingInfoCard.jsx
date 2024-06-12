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
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../config/firebase';

export default function OutlinedCard() {
    const [activeCompany, setActiveCompany] = useState(null)
    const [isBiddingActive, setIsBiddingActive] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "controlData", "activeCompany"), async (doc) => {
            const companyRef = (doc.data().companyRef)
            if (companyRef) {
                const data = await getDoc(companyRef)
                setActiveCompany(data.data())
                setIsBiddingActive(data.data().isBiddingActive)
            } else {
                setActiveCompany(null)
            }
        });
        return () => unsubscribe();
    }, []);

    const setBiddingStatus = async (biddingStatus) => {
        console.log(biddingStatus, "--")
        await updateDoc(doc(db, "controlData", "activeCompany"), {
            isBiddingActive: biddingStatus
        })
        setIsBiddingActive(biddingStatus)
    };
    if (activeCompany === null) {
        return (
            <>
                Loading...
            </>
        )
    }
    return (
        <>
            <Card variant="outlined" sx={{ maxWidth: 360 }}>
                <Box sx={{ p: 2, pb: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" >
                        <Typography variant="h6" component="div">
                            {activeCompany?.companyName}
                        </Typography>
                        <Button variant="contained" color="primary">Change Margin</Button>
                        <Button
                            variant="contained"
                            color={isBiddingActive ? "error" : "success"}
                            onClick={() => setBiddingStatus(!isBiddingActive)}
                        >
                            {isBiddingActive ? "Stop" : "Start"}
                        </Button>
                    </Stack>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <>
                    <Box sx={{ p: 2, pb: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h6" component="div">
                                Bidding Margin
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                {activeCompany?.biddingMargin}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, pt: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0 }}>
                                Bidders
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                {activeCompany?.bidders ? Object.keys(activeCompany.bidders).length : null}
                            </Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <List sx={{ pt: 0 }}>
                                {activeCompany?.bidders && Object.keys(activeCompany.bidders).map((bidder, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem sx={{ py: 0, pt: 1 }}>
                                            <ListItemText primary={activeCompany.bidders[bidder].userName} />
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
