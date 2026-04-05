import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Stack, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Link
} from '@mui/material';
import { 
  Google as GoogleIcon, 
  School as EducationIcon, 
  Groups as NetworkingIcon,
  Handshake as HandshakeIcon
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [openTerms, setOpenTerms] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // App.jsx handles navigation based on auth state
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const animations = {
    '@keyframes float': {
      '0%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-15px)' },
      '100%': { transform: 'translateY(0px)' },
    },
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0px)' },
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#ffffff', // Pure white background
      position: 'relative',
      overflow: 'hidden',
      ...animations
    }}>
      {/* Very subtle decorative elements */}
      <Box sx={{ 
        position: 'absolute', 
        top: '10%', 
        right: '10%', 
        opacity: 0.03, // Extremely subtle
        animation: 'float 10s infinite ease-in-out'
      }}>
        <EducationIcon sx={{ fontSize: '15rem', color: '#1a365d' }} />
      </Box>
      <Box sx={{ 
        position: 'absolute', 
        bottom: '5%', 
        left: '5%', 
        opacity: 0.03, // Extremely subtle
        animation: 'float 12s infinite ease-in-out reverse'
      }}>
        <NetworkingIcon sx={{ fontSize: '18rem', color: '#2563EB' }} />
      </Box>

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 4, md: 6 }, 
          borderRadius: '40px', 
          textAlign: 'center',
          background: '#ffffff',
          border: '1px solid #f1f5f9', // Very light border
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a365d', mb: 1, letterSpacing: '-0.5px' }}>
              College Connect<span style={{ color: '#2563EB' }}>.</span>
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Build the future of your network today.
            </Typography>
          </Box>

          <Stack spacing={3}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                py: 2,
                borderRadius: '16px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#ffffff',
                bgcolor: '#1a365d',
                boxShadow: '0 10px 20px rgba(26, 54, 93, 0.1)',
                '&:hover': {
                  bgcolor: '#2563EB',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 30px rgba(37, 99, 235, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Continue with Google
            </Button>
            
            <Typography variant="caption" sx={{ color: '#94a3b8', mt: 4, px: 2, lineHeight: 1.6 }}>
              By continuing, you agree to our{' '}
              <Link 
                component="button" 
                variant="caption" 
                onClick={() => setOpenTerms(true)}
                sx={{ color: '#1a365d', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link 
                component="button" 
                variant="caption" 
                onClick={() => setOpenTerms(true)}
                sx={{ color: '#1a365d', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Privacy Policy
              </Link>.
            </Typography>
          </Stack>
        </Paper>
      </Container>

      {/* Terms & Conditions Dialog */}
      <Dialog 
        open={openTerms} 
        onClose={() => setOpenTerms(false)}
        PaperProps={{
          sx: { borderRadius: '24px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: '#1a365d' }}>
          Terms & Privacy Policy
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#f1f5f9' }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                1. Professional Conduct
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                College Connect is an elite network for alumni and students. By joining, you agree to maintain professional decorum and foster a supportive environment for career growth and networking.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                2. Data Privacy
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                We value your privacy. Your data, including profiles and resumes, will only be used to generate personal recommendations and help you connect with relevant members within your network.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                3. Accurate Information
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                You agree to provide true and accurate information regarding your college, graduation year, and professional experience to ensure the integrity of the network.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenTerms(false)} 
            variant="contained" 
            sx={{ borderRadius: '12px', bgcolor: '#1a365d', fontWeight: 700, px: 4 }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
