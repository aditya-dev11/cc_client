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
    Divider,
    Grid,
    Chip,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Code as CodeIcon,
    Palette as PaletteIcon,
    MusicNote as MusicIcon,
    SportsEsports as GamingIcon,
    CameraAlt as PhotographyIcon,
    FlightTakeoff as TravelIcon,
    MenuBook as ReadingIcon,
    FitnessCenter as FitnessIcon,
    Movie as MovieIcon,
    Restaurant as FoodIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, saveUserProfile } from '../services/firestoreService';
import CareerForm from '../components/User/CareerForm';

const PREDEFINED_INTERESTS = [
    { label: 'Coding', icon: <CodeIcon /> },
    { label: 'Design', icon: <PaletteIcon /> },
    { label: 'Music', icon: <MusicIcon /> },
    { label: 'Gaming', icon: <GamingIcon /> },
    { label: 'Photography', icon: <PhotographyIcon /> },
    { label: 'Travel', icon: <TravelIcon /> },
    { label: 'Reading', icon: <ReadingIcon /> },
    { label: 'Fitness', icon: <FitnessIcon /> },
    { label: 'Movies', icon: <MovieIcon /> },
    { label: 'Food & Cooking', icon: <FoodIcon /> },
];

const UpdateProfilePage = () => {
    const { user, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                try {
                    const data = await getUserProfile(user.uid);
                    if (data) setProfile(data);
                } catch (err) {
                    setError('Failed to fetch profile.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialPlatform = name.split('_')[1];
            setProfile(prev => ({
                ...prev,
                socialLinks: {
                    ...(prev.socialLinks || {}),
                    [socialPlatform]: value
                }
            }));
        } else if (name === 'skills') {
            // Split by comma for arrays
            setProfile(prev => ({
                ...prev,
                [name]: value.split(',').map(item => item.trim())
            }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleInterestToggle = (interestLabel) => {
        setProfile(prev => {
            const currentInterests = prev.interests || [];
            if (currentInterests.includes(interestLabel)) {
                return { ...prev, interests: currentInterests.filter(i => i !== interestLabel) };
            } else {
                return { ...prev, interests: [...currentInterests, interestLabel] };
            }
        });
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        setSuccess('');
        setError('');
        setSaving(true);

        try {
            await saveUserProfile(user.uid, profile);
            setSuccess('Profile updated successfully!');
            // clear success after a few seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress sx={{ color: '#FF9800' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 0, color: '#FF9800' }}>
                    Complete Your Profile
                </Typography>
                <Button variant="outlined" onClick={() => navigate('/')} sx={{ color: '#FF9800', borderColor: '#FF9800' }}>
                    Back to Dashboard
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleProfileUpdate} sx={{ mb: 4 }}>
                <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid #EEEEEE' }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                        Personal Details
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                name="displayName"
                                label="Full Name"
                                value={profile.displayName || ''}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="birthday"
                                label="Birthday"
                                type="date"
                                value={profile.birthday || ''}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="gender-label" shrink>Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    name="gender"
                                    value={profile.gender || ''}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Please Select Gender</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="marital-status-label" shrink>Marital Status</InputLabel>
                                <Select
                                    labelId="marital-status-label"
                                    name="maritalStatus"
                                    value={profile.maritalStatus || ''}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Please Select Status</MenuItem>
                                    <MenuItem value="Single">Single</MenuItem>
                                    <MenuItem value="Married">Married</MenuItem>
                                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500, color: '#555' }}>
                                Select your Interests
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                {PREDEFINED_INTERESTS.map((interest) => {
                                    const isSelected = profile.interests?.includes(interest.label);
                                    return (
                                        <Chip
                                            key={interest.label}
                                            icon={interest.icon}
                                            label={interest.label}
                                            onClick={() => handleInterestToggle(interest.label)}
                                            sx={{
                                                py: 2.5,
                                                px: 1,
                                                borderRadius: '16px',
                                                fontSize: '0.95rem',
                                                fontWeight: isSelected ? 600 : 400,
                                                bgcolor: isSelected ? 'rgba(255, 152, 0, 0.15)' : '#f5f5f5',
                                                color: isSelected ? '#E65100' : '#444',
                                                border: `2px solid ${isSelected ? '#FF9800' : 'transparent'}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: isSelected ? 'rgba(255, 152, 0, 0.25)' : '#e0e0e0',
                                                    transform: 'translateY(-2px)'
                                                },
                                                '& .MuiChip-icon': {
                                                    color: isSelected ? '#FF9800' : '#777'
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid #EEEEEE' }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                        Social Links
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="social_instagram"
                                label="Instagram Username"
                                value={profile.socialLinks?.instagram || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="social_facebook"
                                label="Facebook Profile URL"
                                value={profile.socialLinks?.facebook || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="social_youtube"
                                label="YouTube Channel URL"
                                value={profile.socialLinks?.youtube || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        color="error"
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
                                try {
                                    setSaving(true);
                                    await deleteAccount();
                                    navigate('/signup');
                                } catch (err) {
                                    console.error(err);
                                    alert("Could not delete account. If you just signed in recently, please log out and log back in, then try again.");
                                    setSaving(false);
                                }
                            }
                        }}
                        disabled={saving}
                        sx={{
                            borderRadius: '30px',
                            px: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                        }}
                    >
                        Delete Account
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        sx={{
                            bgcolor: '#FF9800',
                            color: '#fff',
                            borderRadius: '30px',
                            px: 5,
                            py: 1.5,
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#F57C00' }
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </Button>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid #EEEEEE' }}>
                <CareerForm />
            </Paper>
        </Container>
    );
};

export default UpdateProfilePage;
