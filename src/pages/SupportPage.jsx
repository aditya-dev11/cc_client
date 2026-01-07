import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import TicketList from '../components/Support/TicketList';

const SupportPage = () => {
    const { user } = useAuth();

    if (!user) return <CircularProgress />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">My Support Tickets</Typography>
                <Typography color="text.secondary">Track the status of your reported issues and feature requests.</Typography>
            </Box>
            <TicketList role={user.role} />
        </Container>
    );
};

export default SupportPage;
