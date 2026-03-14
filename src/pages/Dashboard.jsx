import React from 'react';
import { useAuth } from '../context/AuthContext';
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

  // Everyone sees the FeedPage now
  return <>hello</>;
}

export default Dashboard;
