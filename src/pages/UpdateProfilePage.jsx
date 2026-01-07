import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Container,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BACKEND_URL } from '../utils/constants';
import CareerForm from '../components/User/CareerForm';
import PortfolioEditor from '../components/User/PortfolioEditor';

const UpdateProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/me');
            setProfile(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch profile.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        setSuccess('');
        setError('');
        const data = new FormData(event.currentTarget);

        // Include all profile details as expected by the backend
        const updatedProfile = {
            bio: data.get('bio'),
            fullName: profile?.Profile?.fullName,
            department: profile?.Profile?.department,
            graduationYear: profile?.Profile?.graduationYear,
        };

        try {
            await api.put('/users/me/profile', updatedProfile);
            setSuccess('Profile updated successfully!');
            fetchProfile();
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update profile.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 0 }}>
                    Update Profile
                </Typography>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Box sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                    Personal Details
                </Typography>
                <Box component="form" onSubmit={handleProfileUpdate} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                        <TextField
                            label="Full Name"
                            value={profile?.Profile?.fullName || ''}
                            fullWidth
                            disabled
                            helperText="Contact admin to change name"
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 3 }}>
                            <TextField
                                label="Department"
                                value={profile?.Profile?.department || ''}
                                fullWidth
                                disabled
                                helperText="Contact admin to change department"
                            />
                            <TextField
                                label="Graduation Year"
                                value={profile?.Profile?.graduationYear || ''}
                                fullWidth
                                disabled
                                helperText="Contact admin to change graduation year"
                            />
                        </Box>
                        <TextField
                            name="bio"
                            label="Bio"
                            defaultValue={profile?.Profile?.bio}
                            multiline
                            rows={4}
                            fullWidth
                            placeholder="Tell us about yourself..."
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="contained">Save</Button>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                    Career & Skills
                </Typography>
                <CareerForm onClose={() => navigate('/dashboard')} onSave={fetchProfile} />

                <Divider sx={{ my: 4 }} />
                <PortfolioEditor />

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                    Profile Resume
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Upload your resume (PDF) to be displayed on your profile.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Upload Resume
                            <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    const formData = new FormData();
                                    formData.append('resume', file);

                                    try {
                                        setLoading(true);
                                        await api.post('/users/me/resume', formData, {
                                            headers: { 'Content-Type': 'multipart/form-data' }
                                        });
                                        setSuccess('Resume uploaded successfully!');
                                        fetchProfile();
                                    } catch (err) {
                                        setError('Failed to upload resume.');
                                        setLoading(false);
                                    }
                                }}
                            />
                        </Button>
                        {profile?.Profile?.resumeUrl && (
                            <Button
                                variant="text"
                                color="primary"
                                href={`${BACKEND_URL}${profile.Profile.resumeUrl}`}
                                target="_blank"
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                View Attached Resume
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default UpdateProfilePage;
