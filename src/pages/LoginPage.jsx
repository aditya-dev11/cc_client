import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Avatar, Alert, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getUserProfile } from '../services/firestoreService';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle the redirection once isAuthenticated becomes true
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    }
  };

  if (isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link to="/recover-account" variant="body2">
              Forgot password?
            </Link>
            <Link to="/signup" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
