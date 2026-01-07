import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      <Typography variant="h4">Dashboard</Typography>
      {user && <Typography>Welcome, {user.name}!</Typography>}
      <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
        Logout
      </Button>
    </Box>
  );
}

export default DashboardPage;
