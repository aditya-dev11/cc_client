import React, { useState, useEffect } from 'react';
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
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Overview from '../components/SuperAdmin/Overview';
import CollegeList from '../components/SuperAdmin/CollegeList';
import CreateCollegeForm from '../components/SuperAdmin/CreateCollegeForm';
import CompanyList from '../components/SuperAdmin/CompanyList';
import SkillList from '../components/SuperAdmin/SkillList';
import AddAdminDialog from '../components/SuperAdmin/AddAdminDialog';
import TicketList from '../components/Support/TicketList';

const drawerWidth = 240;

function SuperAdminDashboard() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'colleges', 'settings'
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenAddAdmin = (college) => {
    setSelectedCollege(college);
    setAddAdminOpen(true);
  };

  const handleCloseAddAdmin = () => {
    setAddAdminOpen(false);
    setSelectedCollege(null);
  };

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await api.get('/super/colleges');
      setColleges(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch colleges.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleCreateSuccess = () => {
    fetchColleges();
    setActiveSection('colleges');
  };

  const handleAddAdminSuccess = () => {
    fetchColleges();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview colleges={colleges} />;
      case 'colleges':
        return (
          <>
            <CollegeList
              colleges={colleges}
              loading={loading}
              error={error}
              setActiveSection={setActiveSection}
              handleOpenAddAdmin={handleOpenAddAdmin}
            />
            <AddAdminDialog
              open={addAdminOpen}
              onClose={handleCloseAddAdmin}
              selectedCollege={selectedCollege}
              onSuccess={handleAddAdminSuccess}
            />
          </>
        );
      case 'create-college':
        return <CreateCollegeForm onSuccess={handleCreateSuccess} />;
      case 'companies':
        return <CompanyList />;
      case 'skills':
        return <SkillList />;
      case 'support':
        return <TicketList role="SUPER_ADMIN" />;
      case 'settings':
        return (
          <Typography paragraph>
            Global settings and configuration options will go here.
          </Typography>
        );
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
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default SuperAdminDashboard;
