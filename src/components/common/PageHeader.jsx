import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PageHeader = ({ title, actionLabel, onAction, actionIcon }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
        }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
                {title}
            </Typography>
            {actionLabel && onAction && (
                <Button
                    variant="contained"
                    onClick={onAction}
                    startIcon={actionIcon}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default PageHeader;
