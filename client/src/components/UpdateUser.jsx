import React, { useEffect, useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function UpdateUser({ userData }) {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [initialBiddingPoints, setInitialBiddingPoints] = useState('');
    const [remainingBiddingPoints, setRemainingBiddingPoints] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (userData) {
            setUserName(userData.userName || '');
            setEmail(userData.email || '');
            setInitialBiddingPoints(userData.initialBiddingPoints || '');
            setRemainingBiddingPoints(userData.remainingBiddingPoints || '');
        }
    }, [userData]);

    const updateCompany = async (remainingBiddingPoints, initialBiddingPoints) => {
        try {
            await updateDoc(doc(db, "users", userData.userId), {
                remainingBiddingPoints,
                initialBiddingPoints
            });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await updateCompany(+remainingBiddingPoints, +initialBiddingPoints)
        setUserName('');
        setEmail('');
        setInitialBiddingPoints('');
        setRemainingBiddingPoints('');
        setOpen(false)
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        if (userData) {
            setUserName(userData.userName || '');
            setEmail(userData.email || '');
            setRemainingBiddingPoints(userData.remainingBiddingPoints || '');
            setInitialBiddingPoints(userData.initialBiddingPoints || '');
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Update</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            label="User Name"
                            fullWidth
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            variant="filled"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Initial Bidding Points"
                            fullWidth
                            type="number"
                            value={initialBiddingPoints}
                            onChange={(e) => setInitialBiddingPoints(e.target.value)}
                            margin="normal"
                            required
                            variant="standard"
                        />
                        <TextField
                            label="Remaining Bidding Points"
                            fullWidth
                            type="number"
                            value={remainingBiddingPoints}
                            onChange={(e) => setRemainingBiddingPoints(e.target.value)}
                            margin="normal"
                            required
                            variant="standard"
                        />

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
