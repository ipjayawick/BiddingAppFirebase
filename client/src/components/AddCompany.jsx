import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AddCompany() {
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [biddingMargin, setBiddingMargin] = useState('');
    const [totalVacancies, setTotalVacancies] = useState('');

    const [open, setOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, "companies",), {
                companyName,
                description,
                totalVacancies: +totalVacancies,
                remainingVacancies: +totalVacancies,
                biddingMargin: +biddingMargin,
                bidders:[]
            });
        } catch (error) {
            console.error('Error adding company to Firestore:', error);
        }
        handleClose()
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setCompanyName('');
        setDescription('');
        setBiddingMargin('');
        setTotalVacancies('');
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Add Company
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        handleSubmit(event)
                    },
                }}>
                <DialogTitle>Register</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Company Name"
                        fullWidth
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        margin="normal"
                        required
                        variant="standard"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        required
                        variant="standard"
                    />
                    <TextField
                        label="Bidding Margin"
                        fullWidth
                        type="number"
                        value={biddingMargin}
                        onChange={(e) => setBiddingMargin(e.target.value)}
                        margin="normal"
                        required
                        variant="standard"
                    />
                    <TextField
                        label="Total Vacancies"
                        fullWidth
                        type="number"
                        value={totalVacancies}
                        onChange={(e) => setTotalVacancies(e.target.value)}
                        margin="normal"
                        required
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
