import React from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    Typography,
    Avatar,
    Chip,
    Divider,
    Stack,
    Box,
    Button
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';

const ProfileCard = ({ profile, onEdit }) => {
    return (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3, position: 'relative', overflow: 'hidden', height: '100%' }}>
            <Avatar
                src={profile.Profile?.profilePictureUrl}
                alt={profile.Profile?.fullName}
                sx={{ width: 140, height: 140, mx: 'auto', mb: 2, border: '5px solid white', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
            />
            <Typography variant="h5" fontWeight="bold" gutterBottom>{profile.Profile?.fullName || profile.username}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>{profile.email}</Typography>
            <Chip label={profile.role} color="primary" size="small" sx={{ mt: 1, mb: 3, fontWeight: 600, textTransform: 'uppercase' }} />

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2} alignItems="flex-start">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon color="action" sx={{ mr: 2 }} />
                    <Box textAlign="left">
                        <Typography variant="caption" color="textSecondary">Department</Typography>
                        <Typography variant="body1" fontWeight="500">{profile.Profile?.department || 'Not set'}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon color="action" sx={{ mr: 2 }} />
                    <Box textAlign="left">
                        <Typography variant="caption" color="textSecondary">Graduation Year</Typography>
                        <Typography variant="body1" fontWeight="500">{profile.Profile?.graduationYear || 'Not set'}</Typography>
                    </Box>
                </Box>
            </Stack>

            <Button
                variant="contained"
                fullWidth
                startIcon={<EditIcon />}
                component={Link}
                to="/update-profile"
                sx={{ mt: 4, borderRadius: 2, py: 1.2 }}
            >
                Edit Profile
            </Button>
        </Paper>
    );
};

export default ProfileCard;
