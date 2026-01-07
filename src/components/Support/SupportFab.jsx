import React, { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SupportTicketModal from './SupportTicketModal';
import { useLocation } from 'react-router-dom';

const SupportFab = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    // Hide on login/register pages if needed, but usually good to have support everywhere
    if (location.pathname === '/login' || location.pathname === '/register') return null;

    return (
        <>
            <Tooltip title="Report an Issue / Support">
                <Fab
                    color="primary"
                    aria-label="support"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000, // Ensure it's above other elements
                    }}
                    onClick={() => setOpen(true)}
                >
                    <SupportAgentIcon />
                </Fab>
            </Tooltip>
            <SupportTicketModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default SupportFab;
