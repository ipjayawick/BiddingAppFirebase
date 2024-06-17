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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await updateDoc(doc(db, "users", userData.userId), {
                remainingBiddingPoints: +remainingBiddingPoints,
                initialBiddingPoints: +initialBiddingPoints
            });
        } catch (error) {
            console.error('Error updating user:', error);
        }
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
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        handleSubmit(event)
                    },
                }}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
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
