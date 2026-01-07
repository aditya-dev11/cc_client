import React from 'react';
import { Box, Typography } from '@mui/material';

const IconLabel = ({ icon: Icon, label, color = 'primary.main', bgColor = '#FFF3E0' }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
                p: 0.8,
                borderRadius: '50%',
                bgcolor: bgColor,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="body2" fontWeight="600" color="text.primary">
                {label}
            </Typography>
        </Box>
    );
};

export default IconLabel;
