import React, { useState } from 'react';
import {
    Paper,
    Box,
    Avatar,
    InputBase,
    Button,
    Divider,
    Chip,
    Stack,
    CircularProgress,
    TextField,
    MenuItem
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_CONFIG = {
    GENERAL: { label: 'General', color: '#536471', activeColor: '#1D9BF0' },
    EVENT: { label: 'Event', color: '#F91880', activeColor: '#F91880' },
    ALUMNI_UPDATE: { label: 'Alumni', color: '#7856FF', activeColor: '#7856FF' },
    ANNOUNCEMENT: { label: 'News', color: '#FF7A00', activeColor: '#FF7A00' },
    ACHIEVEMENT: { label: 'Achievement', color: '#00BA7C', activeColor: '#00BA7C' },
    CAREER_UPDATE: { label: 'Career', color: '#1D9BF0', activeColor: '#1D9BF0' }
};

const ACHIEVEMENT_TYPES = [
    'Job / Placement',
    'Internship',
    'Hackathon / Tech',
    'Sports Victory',
    'Cultural / Arts',
    'Research / Paper',
    'Project / Startup',
    'Certification',
    'Leadership Role'
];

const CAREER_TYPES = [
    'Job Opportunity',
    'Internship',
    'Walk-in Drive',
    'Referral',
    'Hiring Challenge',
    'Workshop / Webinar'
];

const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const [loading, setLoading] = useState(false);

    // Additional fields
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [achievementType, setAchievementType] = useState('');
    const [careerType, setCareerType] = useState('');

    const handlePost = async () => {
        if (!content.trim()) return;

        setLoading(true);
        try {
            const payload = {
                content,
                category,
                eventStartDate: category === 'EVENT' ? eventStartDate : null,
                eventEndDate: category === 'EVENT' ? eventEndDate : null,
                achievementType: category === 'ACHIEVEMENT' ? achievementType : null,
                careerType: category === 'CAREER_UPDATE' ? careerType : null
            };

            const response = await api.post('/posts', payload);

            // Reset form
            setContent('');
            setCategory('GENERAL');
            setEventStartDate('');
            setEventEndDate('');
            setAchievementType('');
            setCareerType('');

            if (onPostCreated) {
                onPostCreated(response.data);
            }
        } catch (error) {
            console.error('Create post failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderBottom: '1px solid #EFF3F4',
                borderRadius: 0
            }}
        >
            <Box sx={{ display: 'flex' }}>
                <Avatar
                    src={user?.profilePictureUrl}
                    sx={{ mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                    <InputBase
                        placeholder="What's happening?"
                        fullWidth
                        multiline
                        minRows={2}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{
                            fontSize: '1.25rem',
                            mb: 2
                        }}
                    />

                    {/* Conditional Fields based on Category */}
                    {category === 'EVENT' && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="Start Date"
                                type="datetime-local"
                                value={eventStartDate}
                                onChange={(e) => setEventStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="End Date"
                                type="datetime-local"
                                value={eventEndDate}
                                onChange={(e) => setEventEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    )}

                    {category === 'ACHIEVEMENT' && (
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                select
                                label="Achievement Type"
                                value={achievementType}
                                onChange={(e) => setAchievementType(e.target.value)}
                                size="small"
                                fullWidth
                            >
                                {ACHIEVEMENT_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    )}

                    {category === 'CAREER_UPDATE' && (
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                select
                                label="Career Opportunity Type"
                                value={careerType}
                                onChange={(e) => setCareerType(e.target.value)}
                                size="small"
                                fullWidth
                            >
                                {CAREER_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 2 }}>

                        {/* Category Selector */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                                <Chip
                                    key={key}
                                    label={config.label}
                                    size="small"
                                    clickable
                                    onClick={() => setCategory(key)}
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: category === key ? config.activeColor : 'transparent',
                                        color: category === key ? 'white' : config.color,
                                        border: `1px solid ${category === key ? config.activeColor : '#EFF3F4'}`,
                                        '&:hover': {
                                            backgroundColor: category === key ? config.activeColor : `${config.color}10`,
                                        }
                                    }}
                                />
                            ))}
                        </Box>

                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                disableElevation
                                disabled={!content.trim() || loading}
                                onClick={handlePost}
                                sx={{
                                    borderRadius: 9999,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    backgroundColor: '#1D9BF0', // Twitter Blue
                                    px: 3,
                                    '&:hover': { backgroundColor: '#1A8CD8' },
                                    '&.Mui-disabled': {
                                        backgroundColor: 'rgba(29, 155, 240, 0.5)',
                                        color: 'white'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default CreatePost;
