import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/HomeRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';

import PersonIcon from '@mui/icons-material/PersonRounded';
import SupportAgentIcon from '@mui/icons-material/SupportAgentRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import MenuIcon from '@mui/icons-material/MenuRounded';
import { useAuth } from '../context/AuthContext';
import LoginIcon from '@mui/icons-material/LoginRounded';
import AnalyticsIcon from '@mui/icons-material/AnalyticsRounded';

const drawerWidth = 280;
const collapsedDrawerWidth = 88;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Responsive Breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [mobileOpen, setMobileOpen] = useState(false);

  // If these roles, they have their own dashboards
  if (user?.role === 'SUPER_ADMIN' || user?.role === 'COLLEGE_ADMIN') return null;

  // Hide Navbar on Login and Recovery pages
  if (location.pathname === '/login' || location.pathname === '/recover-account') return null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user ? [
    { label: 'Feed', icon: <HomeIcon />, path: '/' },
    { label: 'Explore', icon: <SearchIcon />, path: '/search' },

    { label: 'Profile', icon: <PersonIcon />, path: `/profile/${user.username}` },
    { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { label: 'My Support', icon: <SupportAgentIcon />, path: '/support' },
  ] : [
    { label: 'Home', icon: <HomeIcon />, path: '/login' },
  ];

  // Determine current width for desktop/tablet
  const currentWidth = isTablet ? collapsedDrawerWidth : drawerWidth;

  const drawerContent = (isCollapsed) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: isCollapsed ? 1 : 3, alignItems: isCollapsed ? 'center' : 'stretch' }}>
      {/* Logo Area */}
      <Box sx={{ mb: 5, px: isCollapsed ? 0 : 2, pt: 1, display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        {isCollapsed ? (
          <Box
            onClick={() => navigate('/')}
            sx={{
              width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer'
            }}
          >
            CC
          </Box>
        ) : (
          <Typography
            variant="h5"
            fontWeight="900"
            color="primary"
            sx={{
              letterSpacing: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            CollegeConnect.
          </Typography>
        )}
      </Box>

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: 8,
                  minHeight: 48,
                  justifyContent: isCollapsed ? 'center' : 'initial',
                  py: 1,
                  px: isCollapsed ? 1 : 2,
                  transition: 'all 0.2s ease-in-out',
                  bgcolor: isActive ? 'rgba(255, 87, 34, 0.08)' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(255, 87, 34, 0.12)' : 'rgba(0,0,0,0.04)',
                    transform: isCollapsed ? 'scale(1.05)' : 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: 'center',
                  color: isActive ? 'primary.main' : 'inherit',
                  '& .MuiSvgIcon-root': { fontSize: 28 }
                }}>
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '1.2rem',
                      letterSpacing: '-0.3px'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* User Profile / Logout */}
      <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'stretch' }}>
        {user ? (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mt: 1,
              borderRadius: 8,
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              py: 1.5,
              px: isCollapsed ? 0 : 3,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)', color: 'error.main' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2, justifyContent: 'center', color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Log out" primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem' }} />}
          </ListItemButton>
        ) : (
          <ListItemButton
            onClick={() => navigate('/login')}
            sx={{
              mt: 2,
              borderRadius: 8,
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              py: 1.5,
              px: isCollapsed ? 0 : 3,
              color: 'primary.main',
              bgcolor: 'rgba(255, 87, 34, 0.08)',
              '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.12)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2, justifyContent: 'center', color: 'inherit' }}>
              <LoginIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Log in" primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem' }} />}
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              color: 'text.primary',
              bgcolor: 'rgba(0,0,0,0.03)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
              borderRadius: '12px',
              width: 40,
              height: 40,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '-0.5px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary?.main || theme.palette.primary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.3rem',
            }}
          >
            CollegeConnect
          </Typography>

          <Box sx={{ width: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {user ? (
              <IconButton onClick={() => navigate(`/profile/${user.username}`)} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'primary.main',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  src={user.profilePicture}
                  alt={user.username}
                >
                  {user.username?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            ) : (
              <IconButton component={Link} to="/login" color="primary" sx={{ bgcolor: 'rgba(0,0,0,0.03)', width: 40, height: 40, borderRadius: '12px' }}>
                <LoginIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      )}

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: currentWidth }, flexShrink: { md: 0 }, transition: 'width 0.2s' }}
      >
        {/* Mobile Temporary Drawer (Coming from Top) */}
        <Drawer
          variant="temporary"
          anchor="top"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', height: 'auto', maxHeight: '80vh', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
          }}
        >
          {drawerContent(false)}
        </Drawer>

        {/* Desktop Permanent Sidebar (Responsive Width) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentWidth,
              borderRight: '1px solid #EFF3F4',
              bgcolor: '#FFFFFF',
              transition: 'width 0.2s',
              overflowX: 'hidden'
            },
          }}
          open
        >
          {drawerContent(isTablet)}
        </Drawer>
      </Box>
    </>
  );
}

export default Navbar;
