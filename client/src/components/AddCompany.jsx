import React, { useState } from 'react';
import { TextField, Button, Container, Box, Card, CardContent, Typography } from '@mui/material';

export default function CompanyForm({ addCompany }) {
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [biddingMargin, setBiddingMargin] = useState('');
    const [totalVacancies, setTotalVacancies] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        await addCompany(companyName, description, +biddingMargin, +totalVacancies)
        setCompanyName('');
        setDescription('');
        setBiddingMargin('');
        setTotalVacancies('');
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div" mb={3}>
                            Add Company
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Company Name"
                                fullWidth
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Bidding Margin"
                                fullWidth
                                type="number"
                                value={biddingMargin}
                                onChange={(e) => setBiddingMargin(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Total Vacancies"
                                fullWidth
                                type="number"
                                value={totalVacancies}
                                onChange={(e) => setTotalVacancies(e.target.value)}
                                margin="normal"
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
