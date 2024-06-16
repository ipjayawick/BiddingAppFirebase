import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

export default function FormDialog({ open, handleClose, currentMargin, changeBiddingMargin }) {
    const [marginValue, setMarginValue] = useState(currentMargin)

    const handleDialogClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setMarginValue(currentMargin)
            handleClose();
        }
    };
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        changeBiddingMargin(+marginValue)
                        handleClose();
                    },
                }}
            >
                <DialogTitle sx={{ pb: 0 }}>Update Bidding Margin</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="normal"
                        id="name"
                        name="email"
                        label="Bidding Margin"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={marginValue}
                        onChange={(event) => setMarginValue(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button type="submit">Update</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
