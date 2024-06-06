import * as React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../config/firebase';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { List, ListItem, ListItemText } from '@mui/material';

export default function OutlinedCard() {
    const { user: userAuth } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "users"));

        const unsubscribe = onSnapshot(
            doc(db, "users", userAuth.uid),
            { includeMetadataChanges: true },
            (doc) => {
                setUser(doc.data())
                setLoading(false)
            });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);


    return (
        <>
            <Card variant="outlined" sx={{ maxWidth: 360 }}>

                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }} src={userAuth.photoURL} />
                    <Typography variant="h6" component="div">
                        {userAuth.displayName}
                    </Typography>
                </Box>
                <Divider sx={{ mt: 2 }} />
                {loading ? (
                    <>
                        Loading...
                    </>
                ) : (
                    <>
                        <Box sx={{ p: 2, pb: 0 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography gutterBottom variant="h6" component="div">
                                    Bidding Points Remaining
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    {user.remainingBiddingPoints}
                                </Typography>
                            </Stack>
                        </Box>
                        <Divider />
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0 }}>
                                Companies
                            </Typography>
                            <Stack spacing={1}>
                                <List sx={{ pt: 0 }}>
                                    {user.companies.map((company, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem sx={{ py: 0, pt: 1 }}>
                                                <ListItemText primary={company} />
                                            </ListItem>
                                            <Divider variant="middle" component="li" />
                                        </React.Fragment>
                                    )
                                    )}
                                </List>
                            </Stack>
                        </Box>
                    </>
                )}
            </Card>
        </>
    );
}
