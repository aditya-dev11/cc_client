import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Alert
} from '@mui/material';
import api from '../../services/api';

const SupportTicketModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('BUG');
    const [priority, setPriority] = useState('MEDIUM');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!title || !description) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/support', { title, description, type, priority });
            setSuccess('Ticket submitted successfully!');
            setTimeout(() => {
                onClose();
                setSuccess('');
                setTitle('');
                setDescription('');
                setType('BUG');
                setPriority('MEDIUM');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError('Failed to submit ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogContent>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Subject"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        select
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        margin="normal"
                    >
                        <MenuItem value="BUG">Bug Report</MenuItem>
                        <MenuItem value="FEATURE_REQUEST">Feature Request</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        select
                        label="Priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        margin="normal"
                    >
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                        <MenuItem value="CRITICAL">Critical</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                        placeholder="Please describe the issue or feature in detail..."
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SupportTicketModal;
