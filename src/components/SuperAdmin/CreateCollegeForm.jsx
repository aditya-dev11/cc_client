import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Alert,
    Grid,
    TextField,
    Divider,
    Button
} from '@mui/material';
import api from '../../services/api';

const CreateCollegeForm = ({ onSuccess }) => {
    const [formError, setFormError] = useState('');

    const handleCreateCollege = async (event) => {
        event.preventDefault();
        setFormError('');
        const data = new FormData(event.currentTarget);
        const name = data.get('collegeName');
        const subdomain = data.get('subdomain');
        const logoUrl = data.get('logoUrl');
        const email = data.get('adminEmail');
        const username = data.get('adminUsername');
        const password = data.get('adminPassword');

        try {
            // Create College and Admin in one request
            await api.post('/super/colleges', {
                name,
                subdomain,
                logoUrl,
                adminEmail: email,
                adminUsername: username,
                adminPassword: password
            });

            onSuccess();
            event.target.reset();
        } catch (err) {
            console.error(err);
            setFormError(err.response?.data?.msg || 'Failed to create college or admin.');
        }
    };

    return (
        <Box maxWidth="md">
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Create New College & Admin</Typography>
            <Paper sx={{ p: 4 }}>
                {formError && <Alert severity="error" sx={{ mb: 3 }}>{formError}</Alert>}
                <Box component="form" onSubmit={handleCreateCollege} noValidate>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>College Details</Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField name="collegeName" label="College Name" fullWidth required placeholder="e.g. Springfield University" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="subdomain" label="Subdomain" fullWidth required placeholder="e.g. springfield" helperText="Used for login (e.g., springfield.college-connect.com)" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="logoUrl" label="College Logo URL" fullWidth placeholder="https://example.com/logo.png" />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>Initial Admin Account</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField name="adminEmail" label="Admin Email" type="email" fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="adminUsername" label="Admin Username" fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="adminPassword" label="Admin Password" type="password" fullWidth required />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button type="submit" variant="contained" size="large" fullWidth>Create College & Admin</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateCollegeForm;
