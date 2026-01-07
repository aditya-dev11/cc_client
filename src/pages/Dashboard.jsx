import React from 'react';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import FeedPage from './FeedPage';
import { Box, Typography } from '@mui/material';

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'COLLEGE_ADMIN':
      return <AdminDashboard />;
    case 'STUDENT':
    case 'ALUMNI':
    case 'FACULTY':
      return <FeedPage />;
    default:
      return (
        <Box>
          <Typography>Unknown user role.</Typography>
        </Box>
      );
  }
}

export default Dashboard;
