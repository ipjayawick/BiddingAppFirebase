import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { List, ListItem, ListItemText } from '@mui/material';


export default function OutlinedCard({ userData }) {

    if (userData === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Card variant="outlined" sx={{ maxWidth: 360 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }} src={userData.photoURL} />
                    <Typography variant="h6" component="div">
                        {userData.userName}
                    </Typography>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <>
                    <Box sx={{ p: 2, pb: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h6" component="div">
                                Bidding Points Remaining
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                {userData.remainingBiddingPoints}
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
                                {userData.companies?.map((company, index) => (
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
            </Card>
        </>
    );
}
