import React from 'react';
import { Link } from 'react-router-dom';
import {
    Paper,
    Typography,
    Stack,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const QuickActions = () => {
    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Button
                    variant="outlined"
                    startIcon={<SearchIcon />}
                    component={Link}
                    to="/search"
                    fullWidth
                    sx={{ justifyContent: 'center', py: 1.5, borderRadius: 2, border: '1px solid #e0e0e0', color: 'text.primary', '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' } }}
                >
                    Find Students
                </Button>

            </Stack>
        </Paper>
    );
};

export default QuickActions;
