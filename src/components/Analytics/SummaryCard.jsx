import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const SummaryCard = ({ title, value, icon, color }) => (
    <Card sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        minWidth: 240, // Ensures card doesn't get too squished
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }
    }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: `${color}15`,
                color: color,
                mr: 2,
                display: 'flex',
                minWidth: 56, // Ensure icon box stays square-ish
                height: 56,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600" noWrap>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="800" color="text.primary">
                    {value?.toLocaleString() || 0}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

export default SummaryCard;
