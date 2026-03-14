import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../services/firestoreService';

const ProfileCompletionWidget = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                try {
                    const profile = await getUserProfile(user.uid);
                    if (profile) {
                        // Define fields we care about for completion
                        const fieldsToCheck = [
                            profile.displayName,
                            profile.birthday,
                            profile.marriageDay,
                            profile.interests,
                            profile.profession,
                            profile.skills,
                            profile.socialLinks?.instagram || profile.socialLinks?.facebook || profile.socialLinks?.youtube
                        ];

                        const filledFields = fieldsToCheck.filter(field =>
                            field !== undefined && field !== null && field !== '' &&
                            (Array.isArray(field) ? field.length > 0 : true)
                        ).length;

                        const percentage = Math.round((filledFields / fieldsToCheck.length) * 100);
                        setCompletionPercentage(percentage);
                    }
                } catch (error) {
                    console.error("Error fetching profile for completion widget", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user]);

    if (loading || completionPercentage === 100) return null; // Hide if loading or 100% complete

    return (
        <Paper elevation={0} sx={{ p: 3, m: 2, borderRadius: 3, border: '1px solid #FF9800', bgcolor: 'rgba(255, 152, 0, 0.03)' }}>
            <Typography variant="h6" fontWeight="bold" color="#FF9800" gutterBottom>
                Complete Your Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Adding more details to your profile helps us build a richer experience for your Family, Class, and Work groups!
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'rgba(255, 152, 0, 0.2)',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#FF9800'
                            }
                        }}
                    />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                        {completionPercentage}%
                    </Typography>
                </Box>
            </Box>

            <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/update-profile')}
                sx={{
                    bgcolor: '#FF9800',
                    color: '#fff',
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#F57C00' }
                }}
            >
                Complete Profile Now
            </Button>
        </Paper>
    );
};

export default ProfileCompletionWidget;
