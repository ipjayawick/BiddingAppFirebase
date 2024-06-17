import React, { useEffect, useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function UpdateCompany({ companyData }) {
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [biddingMargin, setBiddingMargin] = useState('');
    const [totalVacancies, setTotalVacancies] = useState('');
    const [remainingVacancies, setRemainingVacancies] = useState('');

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (companyData) {
            setCompanyName(companyData.companyName || '');
            setDescription(companyData.description || '');
            setTotalVacancies(companyData.totalVacancies || '');
            setRemainingVacancies(companyData.remainingVacancies || '');
            setBiddingMargin(companyData.biddingMargin || '');
        }
    }, [companyData]);



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await updateDoc(doc(db, "companies", companyData.companyId), {
                description,
                totalVacancies: +totalVacancies,
                remainingVacancies: +remainingVacancies,
                biddingMargin: +biddingMargin
            });
        } catch (error) {
            console.error('Error adding company to Firestore:', error);
        }
        setOpen(false)
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        if (companyData) {
            setCompanyName(companyData.companyName || '');
            setDescription(companyData.description || '');
            setTotalVacancies(companyData.totalVacancies || '');
            setRemainingVacancies(companyData.remainingVacancies || '');
            setBiddingMargin(companyData.biddingMargin || '');
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Update</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        handleSubmit(event);
                    },
                }}>
                <DialogTitle>Edit Company</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Company Name"
                        fullWidth
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        margin="normal"
                        required
                        variant="filled"
                        InputProps={{
                            readOnly: true,
                        }}
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
                        label="Total Vacancies"
                        fullWidth
                        type="number"
                        value={totalVacancies}
                        onChange={(e) => setTotalVacancies(e.target.value)}
                        margin="normal"
                        required
                        variant="standard"
                    />
                    <TextField
                        label="Remaining Vacancies"
                        fullWidth
                        type="number"
                        value={remainingVacancies}
                        onChange={(e) => setRemainingVacancies(e.target.value)}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
