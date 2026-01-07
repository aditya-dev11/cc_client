import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';
import api from '../services/api';

function AccountRecoveryPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const data = new FormData(event.currentTarget);
    const rollNumber = data.get('rollNumber');
    const collegeSubdomain = data.get('collegeSubdomain');
    const newPassword = data.get('newPassword');
    const dob = data.get('dob');

    try {
      const response = await api.post('/auth/recover-password', {
        rollNumber,
        collegeSubdomain,
        newPassword,
        dob
      });

      if (response.data.success) {
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Account Recovery
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="rollNumber"
            label="Roll Number"
            name="rollNumber"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="collegeSubdomain"
            label="College Subdomain"
            id="collegeSubdomain"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="dob"
            label="Date of Birth"
            type="date"
            id="dob"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AccountRecoveryPage;
