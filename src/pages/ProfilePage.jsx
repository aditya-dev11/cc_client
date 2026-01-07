import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Avatar,
  Container,
  Button,
  Stack
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import MovieIcon from '@mui/icons-material/Movie';
import BookIcon from '@mui/icons-material/Book';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AppsIcon from '@mui/icons-material/Apps';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LanguageIcon from '@mui/icons-material/Language';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Common Components
import LoadingScreen from '../components/common/LoadingScreen';
import IconLabel from '../components/common/IconLabel';
import SectionCard from '../components/common/SectionCard';
import StatusChip from '../components/common/StatusChip';

function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${username}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch profile.');
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getPortfolioIcon = (type) => {
    switch (type) {
      case 'PROJECT': return <CodeIcon color="primary" />;
      case 'PUBLICATION': return <BookIcon color="secondary" />;
      case 'PRODUCT': return <BusinessIcon color="info" />;
      case 'MEDIA': return <MovieIcon color="error" />;
      case 'DESIGN': return <DesignServicesIcon color="warning" />;
      case 'ACHIEVEMENT': return <EmojiEventsIcon color="success" />;
      default: return <AppsIcon />;
    }
  };

  const getPortfolioLabel = (type) => {
    switch (type) {
      case 'PROJECT': return 'Project / Code';
      case 'PUBLICATION': return 'Writing / Publication';
      case 'PRODUCT': return 'App / Game / Website';
      case 'MEDIA': return 'Video / Content';
      case 'DESIGN': return 'Design / Art';
      case 'ACHIEVEMENT': return 'Award / Achievement';
      case 'OTHER': return 'Other';
      default: return type;
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 6 } }}>
        {/* Header Section (Airbnb style) */}
        <Box sx={{ py: 4 }}>
          {/* Horizontal Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: '#ffffff'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
              {/* Avatar Section */}
              <Box sx={{ position: 'relative' }}>
                {profile.Profile?.profilePictureUrl ? (
                  <Avatar
                    src={profile.Profile.profilePictureUrl}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid #ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'primary.main',
                      fontSize: '3rem',
                      fontWeight: 700,
                      border: '4px solid #ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {getInitials(profile.Profile?.fullName || profile.username)}
                  </Avatar>
                )}
                <Box sx={{ position: 'absolute', bottom: 5, right: -5 }}>
                  <StatusChip
                    label={profile.role === 'ALUMNI' ? 'Alumni' : 'Student'}
                    type="role"
                  />
                </Box>
              </Box>

              {/* Info Section */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#1a1a1a' }}>
                  {profile.Profile?.fullName || profile.username}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
                  @{profile.username}
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  alignItems="center"
                  sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap', gap: 2 }}
                >
                  <IconLabel
                    icon={SchoolIcon}
                    label={profile.Profile?.department || 'N/A'}
                  />

                  <IconLabel
                    icon={CalendarTodayIcon}
                    label={`Class of ${profile.Profile?.graduationYear || 'N/A'}`}
                  />

                  {profile.Profile?.location && (
                    <IconLabel
                      icon={LocationOnIcon}
                      label={profile.Profile.location}
                    />
                  )}
                </Stack>
              </Box>

              {/* Actions Section */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                {user && user.username === profile.username && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/update-profile')}
                    startIcon={<EditIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 50,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(255, 87, 34, 0.05)'
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
                {profile.Profile?.resumeUrl && (
                  <Button
                    variant="contained"
                    color="primary"
                    href={`http://localhost:3000${profile.Profile.resumeUrl}`}
                    target="_blank"
                    startIcon={<DescriptionIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 50,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 8px 20px rgba(255, 87, 34, 0.3)',
                      backgroundColor: '#FF5722',
                      '&:hover': {
                        boxShadow: '0 10px 25px rgba(255, 87, 34, 0.5)',
                        transform: 'translateY(-2px)',
                        backgroundColor: '#E64A19',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View Resume
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Details Content */}
          <Box sx={{ mt: 4 }}>
            <SectionCard title="About">
              <Typography variant="body1" sx={{ color: '#222222', lineHeight: 1.7, fontSize: '1.05rem' }}>
                {profile.Profile?.bio || 'No bio provided.'}
              </Typography>
            </SectionCard>

            <SectionCard title="Experience">
              {profile.Experiences && profile.Experiences.length > 0 ? (
                profile.Experiences.map((exp) => (
                  <Box key={exp.id} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: '#f7f7f7',
                          color: '#111b21'
                        }}
                      >
                        <BusinessIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="700">
                          {exp.title}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="500" sx={{ color: '#222222' }}>
                          {exp.Company?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#444444' }}>
                          {exp.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No experience listed.</Typography>
              )}
            </SectionCard>

            <SectionCard title="Skills" noDivider>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {profile.Skills && profile.Skills.length > 0 ? (
                  profile.Skills.map((skill) => (
                    <StatusChip
                      key={skill.id}
                      label={skill.name}
                      type="skill"
                      size="medium"
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">No skills listed.</Typography>
                )}
              </Box>
            </SectionCard>

            {/* Portfolio Section */}
            {profile.Portfolios && profile.Portfolios.length > 0 && (
              <SectionCard title="Portfolio & Creative Works" noDivider>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  {profile.Portfolios.map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                      {item.imageUrl && (
                        <Box
                          component="img"
                          src={item.imageUrl}
                          alt={item.title}
                          sx={{
                            width: '100%',
                            height: 180,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mb: 2,
                            bgcolor: '#f0f0f0'
                          }}
                        />
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        {getPortfolioIcon(item.type)}
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                          {getPortfolioLabel(item.type)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5, fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                      {item.role && (
                        <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                          {item.role}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </Typography>

                      {item.type === 'MEDIA' && item.url && item.url.includes('youtube') && (
                        <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'black', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${item.url.split('v=')[1]?.split('&')[0]}`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            allowFullScreen
                            title={item.title}
                          />
                        </Box>
                      )}

                      <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                        {['PRODUCT', 'MEDIA', 'PROJECT', 'DESIGN'].includes(item.type) && item.iframeUrl && (
                          <Button size="small" variant="contained" onClick={() => window.open(item.iframeUrl, '_blank')}>
                            Launch / Play
                          </Button>
                        )}
                        {item.url && (
                          <Button size="small" variant={item.iframeUrl ? "text" : "outlined"} href={item.url} target="_blank">
                            View Link
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </SectionCard>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ProfilePage;
