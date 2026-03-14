import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, useTheme, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const manamTranslations = ['Manam', 'మనం', 'मनम'];

function LandingPage() {
    const navigate = useNavigate();
    const theme = useTheme();

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fading out

            setTimeout(() => {
                setCurrentWordIndex((prev) => (prev + 1) % manamTranslations.length);
                setFade(true); // Fade back in with new word
            }, 500); // 500ms allows the transition to complete

        }, 3000); // Change word every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Hero Section */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 3,
                    py: { xs: 8, md: 15 },
                    backgroundColor: '#FFFFFF', // Clean white background
                    color: '#333333', // Dark gray text
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative subtle orbs */}
                <Box sx={{
                    position: 'absolute', width: '300px', height: '300px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,152,0,0.08) 0%, rgba(255,152,0,0) 70%)',
                    top: '-50px', left: '-50px', filter: 'blur(40px)'
                }} />
                <Box sx={{
                    position: 'absolute', width: '400px', height: '400px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(158,158,158,0.1) 0%, rgba(158,158,158,0) 70%)',
                    bottom: '-100px', right: '-100px', filter: 'blur(50px)'
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '4rem', md: '7rem' },
                            letterSpacing: '-2px',
                            color: '#FF9800', // Vibrant Orange
                            mb: 2,
                            opacity: fade ? 1 : 0,
                            transform: fade ? 'translateY(0)' : 'translateY(-40px)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth roll
                            minHeight: { xs: '80px', md: '130px' }, // Prevent layout shift during fade
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {manamTranslations[currentWordIndex]}
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 500,
                            mb: 4,
                            color: '#555555', // Medium Gray
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            lineHeight: 1.4
                        }}
                    >
                        Weaving the threads of Family, Class, and Work.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 6,
                            color: '#777777', // Lighter Gray
                            fontSize: '1.1rem',
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        A premium network designed to visually celebrate your connections. Create distinct spaces for your family tree, your classmates, or your professional network, all uniquely tailored to you.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/signup')}
                            sx={{
                                bgcolor: '#FF9800', // Orange
                                color: '#FFFFFF',
                                px: 5,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: '30px',
                                '&:hover': { bgcolor: '#F57C00' }
                            }}
                        >
                            Start Your Journey
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                color: '#FF9800',
                                borderColor: '#FF9800',
                                px: 5,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: '30px',
                                '&:hover': { borderColor: '#F57C00', bgcolor: 'rgba(255,152,0,0.05)' }
                            }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Feature Highlights */}
            <Container maxWidth="lg" sx={{ py: 10, bgcolor: '#FAFAFA' }}>
                <Grid container spacing={6}>
                    {/* Feature 1 */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #EEEEEE', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,152,0,0.1)', width: 60, height: 60, mb: 3 }}>
                                <GroupsIcon sx={{ fontSize: 30, color: '#FF9800' }} />
                            </Avatar>
                            <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom sx={{ color: '#333333' }}>
                                Meaningful Groups
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Organize your life. Create distinct, beautiful spaces for your extended family, your university classmates, and your workplace colleagues.
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Feature 2 */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #EEEEEE', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,152,0,0.1)', width: 60, height: 60, mb: 3 }}>
                                <AutoAwesomeIcon sx={{ fontSize: 30, color: '#FF9800' }} />
                            </Avatar>
                            <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom sx={{ color: '#333333' }}>
                                Dynamic Visuals
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Experience unparalleled aesthetics. Watch your family tree grow, see your classmates on benches, and your colleagues in their professional environment.
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Feature 3 */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #EEEEEE', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,152,0,0.1)', width: 60, height: 60, mb: 3 }}>
                                <ConnectWithoutContactIcon sx={{ fontSize: 30, color: '#FF9800' }} />
                            </Avatar>
                            <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom sx={{ color: '#333333' }}>
                                Deep Profiles
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                More than just a picture. Parse your resume automatically, link your social media, and celebrate important life events together.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default LandingPage;
