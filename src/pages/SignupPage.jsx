import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Avatar, Alert, CircularProgress } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { saveUserProfile, getUserProfile } from '../services/firestoreService';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';

function SignupPage() {
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
        const name = data.get('name');
        const username = data.get('username');
        const email = data.get('email');
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');

        if (!username) {
            return setError('Username is required');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Attempt to save basic information to firestore
            await saveUserProfile(user.uid, {
                email: user.email,
                displayName: name || email.split('@')[0],
                username: username,
                onboardingCompleted: false
            });

            // After successful signup, redirect is handled by useEffect
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <PersonAddOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link to="/login" variant="body2">
                            Already have an account? Sign In
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default SignupPage;
