import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Avatar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const collegeSubdomain = data.get('collegeSubdomain');

    try {
      const response = await api.post('/auth/login', {
        login: email,
        password,
        collegeSubdomain: collegeSubdomain || null
      });

      if (response.data.success) {
        // The token includes 'Bearer ' (optional check, but backend sends raw token now? No, backend sends raw token in new code)
        // Wait, my backend code sends: { success: true, accessToken, refreshToken }
        // The old code sent: { success: true, token: 'Bearer ' + token }
        // I need to be careful. My new backend code sends raw tokens.

        const { accessToken, refreshToken } = response.data;
        login(accessToken, refreshToken);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login.');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email or Username"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            fullWidth
            name="collegeSubdomain"
            label="College Subdomain (optional)"
            id="collegeSubdomain"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Link to="/recover-account" variant="body2">
            Forgot password?
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
