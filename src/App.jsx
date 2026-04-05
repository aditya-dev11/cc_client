import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './utils/AuthContext';

function AppRoutes() {
  const { user, userData, loading } = useAuth();

  if (loading) return null; // Or a sleek loader

  return (
    <Routes>
      <Route path="/" element={
        user ? (
          userData?.onboarded ? <Navigate to="/dashboard" /> : <Navigate to="/profile" />
        ) : (
          <LandingPage />
        )
      } />
      
      <Route path="/auth" element={
        user ? (
          userData?.onboarded ? <Navigate to="/dashboard" /> : <Navigate to="/profile" />
        ) : (
          <AuthPage />
        )
      } />

      <Route path="/profile" element={
        user ? <ProfilePage /> : <Navigate to="/auth" />
      } />

      <Route path="/dashboard" element={
        user ? (
          userData?.onboarded ? <DashboardPage /> : <Navigate to="/profile" />
        ) : (
          <Navigate to="/auth" />
        )
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
              <AppRoutes />
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
