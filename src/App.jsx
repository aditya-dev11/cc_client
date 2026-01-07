import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AccountRecoveryPage from './pages/AccountRecoveryPage';
import Navbar from './components/Navbar';
import UpdateProfilePage from './pages/UpdateProfilePage';
import PostDetailsPage from './pages/PostDetailsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

import SupportPage from './pages/SupportPage';
import SupportFab from './components/Support/SupportFab';
import './App.css';

import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, width: { xs: '100%', md: `calc(100% - 88px)`, lg: `calc(100% - 280px)` }, minHeight: '100vh', bgcolor: '#fff' }}>
          <SupportFab />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recover-account" element={<AccountRecoveryPage />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/update-profile" element={<UpdateProfilePage />} />
              <Route path="/post/:id" element={<PostDetailsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
