import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ label, type = 'default', size = 'small', ...props }) => {
    let styles = {
        fontWeight: 600,
        borderRadius: 1.5,
    };

    switch (type) {
        case 'active':
        case 'verified':
            styles = { ...styles, bgcolor: 'rgba(46, 125, 50, 0.1)', color: 'rgb(46, 125, 50)' };
            break;
        case 'pending':
            styles = { ...styles, bgcolor: 'rgba(237, 108, 2, 0.1)', color: 'rgb(237, 108, 2)' };
            break;
        case 'error':
        case 'rejected':
            styles = { ...styles, bgcolor: 'rgba(211, 47, 47, 0.1)', color: 'rgb(211, 47, 47)' };
            break;
        case 'role':
            styles = { ...styles, bgcolor: '#263238', color: 'white' };
            break;
        case 'skill':
            styles = {
                ...styles,
                bgcolor: 'white',
                border: '1px solid #e0e0e0',
                color: 'text.primary',
                py: 0.5
            };
            break;
        default:
            styles = { ...styles, bgcolor: 'rgba(0, 0, 0, 0.08)', color: 'text.primary' };
    }

    return (
        <Chip
            label={label}
            size={size}
            sx={{ ...styles, ...props.sx }}
            {...props}
        />
    );
};

export default StatusChip;
