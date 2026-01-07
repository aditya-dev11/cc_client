import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const SectionCard = ({ title, children, action, noDivider = false }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="800" color="text.primary">
                    {title}
                </Typography>
                {action}
            </Box>

            <Box>
                {children}
            </Box>

            {!noDivider && <Divider sx={{ mt: 4 }} />}
        </Box>
    );
};

export default SectionCard;
