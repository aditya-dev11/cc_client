import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AccountRecoveryPage from './pages/AccountRecoveryPage';
import Navbar from './components/Navbar';
import UpdateProfilePage from './pages/UpdateProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import ChatsPage from './pages/ChatsPage';
import GroupsPage from './pages/GroupsPage';
import GroupChatPage from './pages/GroupChatPage';
import GroupJoinPage from './pages/GroupJoinPage';

import './App.css';

import { Box } from '@mui/material';

function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, width: { xs: '100%', md: `calc(100% - 88px)`, lg: `calc(100% - 280px)` }, minHeight: '100vh', bgcolor: '#fff' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/recover-account" element={<AccountRecoveryPage />} />

            {/* Public Landing Page */}
            <Route path="/" element={isAuthenticated ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <LandingPage />} />

            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/update-profile" element={<UpdateProfilePage />} />
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/chats/:chatId" element={<ChatsPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groups/:groupId/chat" element={<GroupChatPage />} />
              <Route path="/groups/join/:groupId" element={<GroupJoinPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
