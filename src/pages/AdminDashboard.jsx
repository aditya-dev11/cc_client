import React, { useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  AppBar,
  Toolbar,
  CssBaseline,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import UserList from '../components/Admin/UserList';
import ImportUsers from '../components/Admin/ImportUsers';
import TicketList from '../components/Support/TicketList';

const drawerWidth = 240;

function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('users'); // 'users', 'import'
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserList />;
      case 'import':
        return <ImportUsers onSuccess={() => setActiveSection('users')} />;
      case 'support':
        return <TicketList role="ADMIN" />;
      default:
        return <Typography paragraph>Select a section.</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f7f7' }}>
      <CssBaseline />

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
      >
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleLogout={handleLogout}
        />
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #f0f0f0',
              bgcolor: '#ffffff'
            },
          }}
          open
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            handleLogout={handleLogout}
          />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f7f7f7',
          minHeight: '100vh'
        }}
      >
        {/* Mobile Header */}
        <Box sx={{ display: { md: 'none' }, mb: 2, pt: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="span" fontWeight="bold" color="text.primary">
            {activeSection === 'users' ? 'Manage Users' : 'Import Users'}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
