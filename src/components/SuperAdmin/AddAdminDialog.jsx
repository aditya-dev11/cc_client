import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    Box,
    DialogContent,
    Alert,
    TextField,
    DialogActions,
    Button
} from '@mui/material';
import api from '../../services/api';

const AddAdminDialog = ({ open, onClose, selectedCollege, onSuccess }) => {
    const [adminFormError, setAdminFormError] = useState('');

    const handleSubmitAddAdmin = async (event) => {
        event.preventDefault();
        setAdminFormError('');
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const username = data.get('username');
        const password = data.get('password');

        try {
            await api.post(`/super/colleges/${selectedCollege.id}/admins`, {
                email,
                username,
                password
            });
            onSuccess();
            onClose();
        } catch (err) {
            setAdminFormError(err.response?.data?.msg || 'Failed to add admin.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Admin to {selectedCollege?.name}</DialogTitle>
            <Box component="form" onSubmit={handleSubmitAddAdmin}>
                <DialogContent>
                    {adminFormError && <Alert severity="error" sx={{ mb: 2 }}>{adminFormError}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="email"
                        label="Admin Email"
                        type="email"
                        fullWidth
                        required
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        name="username"
                        label="Admin Username"
                        type="text"
                        fullWidth
                        required
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">Add Admin</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default AddAdminDialog;
