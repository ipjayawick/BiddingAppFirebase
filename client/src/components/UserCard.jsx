import * as React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';


const user = {
    remainingPoints: "90",
    companies: "Company 1, Company 2"
}

export default function OutlinedCard() {
    return (
        <>
            <Card sx={{ maxWidth: 345, mx: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    </Avatar>
                    <Typography variant="h6" component="div">
                        {"Isuru"}
                    </Typography>
                </Box>
                <CardContent>
                    <Typography variant="body2" color="textSecondary">
                        Remaining Bidding Points: {user.remainingPoints}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Companies: {user.companies}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
}
