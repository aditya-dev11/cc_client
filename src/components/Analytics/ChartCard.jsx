import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const ChartCard = ({ title, children, height = 400, sx = {}, ...props }) => {
    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 3,
                height: height,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 300, // Ensure charts have enough horizontal space
                ...sx
            }}
            {...props}
        >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
                {children}
            </Box>
        </Paper>
    );
};

export default ChartCard;
