import React from 'react';
import {
    Box,
    Typography,
    Modal,
    TextField,
    Grid,
    Button,
    Divider
} from '@mui/material';
import CareerForm from './CareerForm';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 2,
};

const EditProfileModal = ({ open, onClose, profile, onSave, fetchProfile }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
                    Edit Profile
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>Personal Details</Typography>
                    <Box component="form" id="profile-form" onSubmit={onSave}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField name="fullName" label="Full Name" defaultValue={profile?.Profile?.fullName} fullWidth variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="bio" label="Bio" defaultValue={profile?.Profile?.bio} multiline rows={3} fullWidth variant="outlined" placeholder="Tell us about yourself..." />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="department" label="Department" defaultValue={profile?.Profile?.department} fullWidth variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="graduationYear" label="Graduation Year" defaultValue={profile?.Profile?.graduationYear} fullWidth variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" size="large">Save Personal Details</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>Career & Skills</Typography>
                    <CareerForm onClose={() => { }} onSave={fetchProfile} />
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} variant="outlined" color="inherit" size="large">Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditProfileModal;
