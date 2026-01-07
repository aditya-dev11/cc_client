import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Stack,
    Chip
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';

const ProfileDetails = ({ profile }) => {
    return (
        <>
            {/* About Section */}
            <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3, bgcolor: 'white' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                    About Me
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ lineHeight: 1.8 }}>
                    {profile.Profile?.bio || 'No bio added yet. Click "Edit Profile" to tell us about yourself.'}
                </Typography>
            </Paper>

            {/* Experience Section */}
            <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3, bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Experience
                    </Typography>
                </Box>

                {profile.Experiences && profile.Experiences.length > 0 ? (
                    <Stack spacing={4}>
                        {profile.Experiences.map((exp, index) => (
                            <Box key={index}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="h6" fontWeight="bold">{exp.title}</Typography>
                                    <Typography variant="caption" color="textSecondary" sx={{ border: '1px solid #ddd', px: 1, py: 0.5, borderRadius: 1 }}>
                                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} -
                                        {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ' Present'}
                                    </Typography>
                                </Box>
                                <Typography variant="subtitle1" color="primary" fontWeight="500" gutterBottom>{exp.Company?.name || exp.companyName}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{exp.description}</Typography>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        No work experience listed.
                    </Typography>
                )}
            </Paper>

            {/* Skills Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CodeIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Skills
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {profile.Skills && profile.Skills.length > 0 ? (
                        profile.Skills.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill.name}
                                sx={{
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    py: 2,
                                    px: 1,
                                    borderRadius: 2
                                }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                            No skills added yet.
                        </Typography>
                    )}
                </Box>
            </Paper>
        </>
    );
};

export default ProfileDetails;
