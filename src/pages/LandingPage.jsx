import { Box, Typography, Button, Container, Stack, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
    Handshake as ConnectionIcon, 
    RocketLaunch as GrowthIcon, 
    Coffee as CatchUpIcon, 
    AutoAwesome as SparkIcon,
    Business as CorporateIcon,
    EmojiEvents as SuccessIcon,
    Psychology as WisdomIcon,
    Diversity1 as SupportIcon,
    LightbulbOutlined as InnovationIcon,
    ChatBubbleOutline as ChatIcon,
    Timeline as JourneyIcon,
    SupportAgent as HelpIcon
} from '@mui/icons-material';

export default function LandingPage() {
    const navigate = useNavigate();

    // Keyframes for elite micro-animations
    const animations = {
        '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-15px)' },
            '100%': { transform: 'translateY(0px)' },
        },
        '@keyframes slideUp': {
            '0%': { opacity: 0, transform: 'translateY(30px)' },
            '100%': { opacity: 1, transform: 'translateY(0px)' },
        },
        '@keyframes gradientFlow': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes floatWeb': {
            '0%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(15px, -15px)' },
            '100%': { transform: 'translate(0, 0)' },
        },
        '@keyframes rotateSlow': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#ffffff', 
            fontFamily: '"Inter", sans-serif',
            position: 'relative',
            overflow: 'hidden',
            ...animations
        }}>
            {/* 'Cause-Driven Symbols' - No Lines, Pure Floating Atmosphere */}
            
            {/* Connection Node (Top Left) - Reconnecting */}
            <Box sx={{ position: 'fixed', top: '15%', left: '8%', animation: 'floatWeb 15s infinite ease-in-out', zIndex: 0 }}>
                <ConnectionIcon sx={{ fontSize: '3rem', color: '#1a365d', opacity: 0.1, animation: 'rotateSlow 40s linear infinite' }} />
            </Box>

            {/* Growth Node (Bottom Right) - Career Referrals */}
            <Box sx={{ position: 'fixed', bottom: '15%', right: '12%', animation: 'floatWeb 20s infinite ease-in-out reverse', zIndex: 0 }}>
                <GrowthIcon sx={{ fontSize: '3.5rem', color: '#2563EB', opacity: 0.08, animation: 'rotateSlow 30s linear infinite reverse' }} />
            </Box>

            {/* Catch-Up Node (Mid Left) - Coffee / Lunch */}
            <Box sx={{ position: 'fixed', top: '40%', left: '5%', animation: 'floatWeb 12s infinite ease-in-out', zIndex: 0 }}>
                <CatchUpIcon sx={{ fontSize: '2.5rem', color: '#F59E0B', opacity: 0.12, animation: 'rotateSlow 45s linear infinite' }} />
            </Box>

            {/* Spark Node (Mid Right) - The 'Spark' of Reconnecting */}
            <Box sx={{ position: 'fixed', top: '25%', right: '10%', animation: 'floatWeb 18s infinite ease-in-out', zIndex: 0 }}>
                <SparkIcon sx={{ fontSize: '2.2rem', color: '#8B5CF6', opacity: 0.15, animation: 'rotateSlow 25s linear infinite reverse' }} />
            </Box>

            {/* Success Node (Bottom Left) - Referrals & Career Wins */}
            <Box sx={{ position: 'fixed', bottom: '10%', left: '15%', animation: 'floatWeb 22s infinite ease-in-out', zIndex: 0 }}>
                <SuccessIcon sx={{ fontSize: '2.8rem', color: '#10B981', opacity: 0.1, animation: 'rotateSlow 35s linear infinite' }} />
            </Box>

            {/* Corporate Node (Top Right) - The 'Firm' Opportunity */}
            <Box sx={{ position: 'fixed', top: '5%', right: '18%', animation: 'floatWeb 28s infinite ease-in-out', zIndex: 0 }}>
                <CorporateIcon sx={{ fontSize: '2rem', color: '#1a365d', opacity: 0.08 }} />
            </Box>

            {/* NEW NODES TO MAKE IT 8: Wisdom and Support */}

            {/* Wisdom Node (Center Mid Right) - Mentorship */}
            <Box sx={{ position: 'fixed', top: '50%', right: '15%', animation: 'floatWeb 24s infinite ease-in-out', zIndex: 0 }}>
                <WisdomIcon sx={{ fontSize: '2.4rem', color: '#4B5563', opacity: 0.08, animation: 'rotateSlow 50s linear infinite' }} />
            </Box>

            {/* Support Node (Bottom Center Right) - Community Strength */}
            <Box sx={{ position: 'fixed', bottom: '15%', right: '35%', animation: 'floatWeb 30s infinite ease-in-out reverse', zIndex: 0 }}>
                <SupportIcon sx={{ fontSize: '2.2rem', color: '#0D9488', opacity: 0.1, animation: 'rotateSlow 40s linear infinite' }} />
            </Box>

            {/* EXPANDING TO 12: Innovation, Journey, Help, and Chat */}

            {/* Innovation Node (Top Mid Left) - New Ideas */}
            <Box sx={{ position: 'fixed', top: '10%', left: '30%', animation: 'floatWeb 28s infinite ease-in-out', zIndex: 0 }}>
                <InnovationIcon sx={{ fontSize: '2rem', color: '#EAB308', opacity: 0.1, animation: 'rotateSlow 35s linear infinite' }} />
            </Box>

            {/* Journey Node (Bottom Mid Left) - Career Paths */}
            <Box sx={{ position: 'fixed', bottom: '30%', left: '35%', animation: 'floatWeb 22s infinite ease-in-out reverse', zIndex: 0 }}>
                <JourneyIcon sx={{ fontSize: '2.5rem', color: '#1a365d', opacity: 0.08, animation: 'rotateSlow 50s linear infinite' }} />
            </Box>

            {/* Chat Node (Center Mid) - Reconnecting Conversations */}
            <Box sx={{ position: 'fixed', top: '50%', left: '20%', animation: 'floatWeb 18s infinite ease-in-out', zIndex: 0 }}>
                <ChatIcon sx={{ fontSize: '1.8rem', color: '#3B82F6', opacity: 0.15 }} />
            </Box>

            {/* Help Node (Top Mid Right) - Dedicated Support */}
            <Box sx={{ position: 'fixed', top: '15%', right: '40%', animation: 'floatWeb 35s infinite ease-in-out reverse', zIndex: 0 }}>
                <HelpIcon sx={{ fontSize: '2rem', color: '#9333EA', opacity: 0.08, animation: 'rotateSlow 45s linear infinite' }} />
            </Box>

            {/* Soft Ambient Globs Still Integrated for Depth */}
            <Box sx={{ 
                position: 'fixed', 
                top: '-10%', 
                left: '-5%', 
                width: '600px', 
                height: '600px', 
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: -1 
            }} />
            <Box sx={{ 
                position: 'fixed', 
                top: '45%', 
                left: '-5%', 
                width: '110%', 
                height: '1px', 
                bgcolor: '#e2e8f0', 
                transform: 'rotate(2deg)',
                zIndex: -1 
            }} />
            <Box sx={{ 
                position: 'fixed', 
                top: '10%', 
                right: '15%', 
                width: '1px', 
                height: '110%', 
                bgcolor: '#f1f5f9', 
                transform: 'rotate(15deg)',
                zIndex: -1 
            }} />
            
            {/* Unique Aurora Blobs - Increased Intensity for Visibility */}
            <Box sx={{ 
                position: 'fixed', 
                top: '-15%', 
                left: '-5%', 
                width: '700px', 
                height: '700px', 
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 60%)',
                filter: 'blur(80px)',
                zIndex: -1,
                animation: 'aurora 20s linear infinite alternate'
            }} />
            <Box sx={{ 
                position: 'fixed', 
                bottom: '-15%', 
                right: '-5%', 
                width: '800px', 
                height: '800px', 
                background: 'radial-gradient(circle, rgba(26, 54, 93, 0.1) 0%, transparent 60%)',
                filter: 'blur(100px)',
                zIndex: -1,
                animation: 'aurora 25s linear infinite reverse'
            }} />
            {/* Minimal Header */}
            <Container maxWidth="lg" sx={{ pt: 3, pb: 2, animation: 'slideUp 0.8s ease-out' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a365d', letterSpacing: '-1px' }}>
                    College Connect<span style={{ color: '#2563EB' }}>.</span>
                </Typography>
            </Container>

            {/* Main Hero Section - Sized for Elegance & Life */}
            <Container maxWidth="md" sx={{ 
                mt: { xs: 10, md: 15 }, 
                textAlign: 'center',
                animation: 'slideUp 1s ease-out forwards'
            }}>
                <Typography 
                    variant="h1" 
                    sx={{ 
                        fontSize: { xs: '2.5rem', md: '3.8rem' }, 
                        fontWeight: 900, 
                        color: '#1e293b',
                        lineHeight: 1.1,
                        mb: 4,
                        letterSpacing: { xs: '-1px', md: '-2px' }
                    }}
                >
                    Reconnect with the <br />
                    <span style={{ 
                        background: 'linear-gradient(-45deg, #1a365d, #2563EB, #1e293b, #3b82f6)',
                        backgroundSize: '400% 400%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'gradientFlow 10s ease infinite',
                        display: 'inline-block'
                    }}>
                        network that matters.
                    </span>
                </Typography>

                <Box sx={{ mt: 8, animation: 'slideUp 1.2s ease-out forwards' }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/auth')}
                        sx={{
                            bgcolor: '#1a365d',
                            color: '#ffffff',
                            px: 8,
                            py: 2.5,
                            borderRadius: '100px', 
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            textTransform: 'none',
                            boxShadow: '0 20px 40px -10px rgba(26, 54, 93, 0.4)',
                            '&:hover': { 
                                bgcolor: '#2563EB', 
                                transform: 'scale(1.05) translateY(-2px)',
                                boxShadow: '0 30px 60px -10px rgba(26, 54, 93, 0.5)'
                            },
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    >
                        Catch where you left off
                    </Button>
                </Box>
            </Container>

            {/* Background Decorative Gradient */}
            <Box sx={{
                position: 'fixed',
                top: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%)',
                zIndex: -1
            }} />
        </Box>
    );
}
