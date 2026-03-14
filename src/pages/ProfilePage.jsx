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
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/ChatRounded';
import GroupIcon from '@mui/icons-material/GroupRounded';
import { BACKEND_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { getUserProfileByUsername, createOrGetChat } from '../services/firestoreService';

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
        const data = await getUserProfileByUsername(username);
        if (data) {
          setProfile(data);
        } else {
          setError('User not found.');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile.');
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Start Chat Handler
  const handleStartChat = async () => {
    if (!user || !profile?.id) return;
    try {
      const currentUserId = user.id || user.uid;
      const chat = await createOrGetChat(currentUserId, profile.id);
      navigate(`/chats/${chat.id}`);
    } catch (err) {
      console.error("Failed to start chat", err);
      alert("Could not start chat. Please try again.");
    }
  };

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
                {profile.profilePictureUrl ? (
                  <Avatar
                    src={profile.profilePictureUrl}
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
                    {getInitials(profile.displayName || profile.username)}
                  </Avatar>
                )}
              </Box>

              {/* Info Section */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#1a1a1a' }}>
                  {profile.displayName || profile.username}
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
                  {profile.birthday && (
                    <IconLabel
                      icon={CalendarTodayIcon}
                      label={`Born: ${formatDate(profile.birthday)}`}
                    />
                  )}

                  {profile.gender && (
                    <IconLabel
                      icon={PersonIcon}
                      label={profile.gender}
                    />
                  )}

                  {profile.maritalStatus && (
                    <IconLabel
                      icon={FavoriteIcon}
                      label={profile.maritalStatus}
                    />
                  )}

                  {profile.location && (
                    <IconLabel
                      icon={LocationOnIcon}
                      label={profile.location}
                    />
                  )}
                </Stack>
              </Box>

              {/* Actions Section */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                {user && user.username === profile.username ? (
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
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleStartChat}
                      startIcon={<ChatIcon />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 50,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px 0 rgba(255, 87, 34, 0.39)'
                      }}
                    >
                      Start Chat
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate('/groups')}
                      startIcon={<GroupIcon />}
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
                      Groups in Common
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Details Content */}
          <Box sx={{ mt: 4 }}>
            {profile.bio && (
              <SectionCard title="About">
                <Typography variant="body1" sx={{ color: '#222222', lineHeight: 1.7, fontSize: '1.05rem' }}>
                  {profile.bio}
                </Typography>
              </SectionCard>
            )}

            <SectionCard title="Experience">
              {profile.experiences && profile.experiences.length > 0 ? (
                profile.experiences.map((exp) => (
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

            {profile.interests && profile.interests.length > 0 && (
              <SectionCard title="Interests">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {profile.interests.map((interest, index) => (
                    <StatusChip
                      key={index}
                      label={interest}
                      type="skill"
                      size="medium"
                    />
                  ))}
                </Box>
              </SectionCard>
            )}

            <SectionCard title="Skills" noDivider>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <StatusChip
                      key={index}
                      label={skill}
                      type="skill"
                      size="medium"
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">No skills listed.</Typography>
                )}
              </Box>
            </SectionCard>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ProfilePage;
