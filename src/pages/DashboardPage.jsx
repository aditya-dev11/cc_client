import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  TextField,
  InputAdornment,
  Fade,
  Badge,
  Card,
  CardContent,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  Insights as StatsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Check as CheckIcon,
  ArrowForward as ArrowIcon,
  Timeline as JourneyIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  School as EducationIcon,
  Send as SendIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap
} from 'recharts';
import { useAuth } from '../utils/AuthContext';
import { discoverProfiles, getNetworkStats } from '../utils/DiscoveryService';
import {
  sendConnectionRequest, 
  getPendingRequests, 
  getSentRequests,
  cancelRequest,
  acceptRequest, 
  getAcceptedConnections 
} from '../utils/ConnectionService';
import { getRecentChats, sendMessage, subscribeToConversation } from '../utils/MessagingService';

const CHART_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

const CustomTreemapContent = ({ x, y, width, height, name, value }) => (
  <g>
    <rect x={x} y={y} width={width} height={height} style={{ fill: '#1e293b', stroke: '#fff', strokeWidth: 2 }} />
    {width > 40 && height > 20 && (
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>
        {name}
      </text>
    )}
  </g>
);

export default function DashboardPage() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [peers, setPeers] = useState([]);
  const [stats, setStats] = useState({ colleges: [], locations: [] });
  const [pendingReqs, setPendingReqs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sentReqs, setSentReqs] = useState([]); // Outgoing pending requests
  const [discoveryFilter, setDiscoveryFilter] = useState('all'); // 'all', 'college', 'company'
  const [discoveryResults, setDiscoveryResults] = useState([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);

  const userCollege = userData?.primaryCollege || userData?.educations?.[0]?.school || "Your College";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [peerList, networkStats, reqs, sent, accepts, chats] = await Promise.all([
          discoverProfiles(user.uid, { college: userCollege }),
          getNetworkStats(),
          getPendingRequests(user.uid),
          getSentRequests(user.uid),
          getAcceptedConnections(user.uid),
          getRecentChats(user.uid)
        ]);
        setPeers(peerList);
        setStats(networkStats);
        setPendingReqs(reqs);
        setSentReqs(sent);
        setConnections(accepts);
        setRecentChats(chats);
      } catch (err) {
        console.error("Dashboard: Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user, userCollege]);

  useEffect(() => {
    const fetchDiscovery = async () => {
      setDiscoveryLoading(true);
      const filters = {};
      if (discoveryFilter === 'college') filters.college = userData?.primaryCollege;
      if (discoveryFilter === 'company') filters.company = userData?.currentCompany;

      const results = await discoverProfiles(user.uid, filters);
      setDiscoveryResults(results);
      setDiscoveryLoading(false);
    };
    if (user && activeTab === 1) fetchDiscovery();
  }, [user, discoveryFilter, activeTab, userData]);

  const getConnectionStatus = (targetUid) => {
    if (connections.some(c => c.uid === targetUid)) return 'connected';
    if (sentReqs.some(r => r.receiverId === targetUid)) return 'sent';
    if (pendingReqs.some(r => r.senderId === targetUid)) return 'pending';
    return 'none';
  };

  const handleConnect = async (targetId) => {
    await sendConnectionRequest(user.uid, targetId);
    const sent = await getSentRequests(user.uid);
    setSentReqs(sent);
  };

  const handleCancel = async (targetId) => {
    const req = sentReqs.find(r => r.receiverId === targetId);
    if (req) {
      await cancelRequest(req.id);
      setSentReqs(p => p.filter(r => r.id !== req.id));
    }
  };

  useEffect(() => {
    let unsubscribe = null;
    if (activeChatUser && activeTab === 3) {
      unsubscribe = subscribeToConversation(user.uid, activeChatUser.uid, (msgs) => {
        setMessages(msgs);
      });
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, [user.uid, activeChatUser, activeTab]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChatUser) return;
    const text = messageText;
    setMessageText(""); // Clear first for speed
    await sendMessage(user.uid, activeChatUser.uid, text);
    // Real-time listener handles the display
  };

  const handleOpenChat = (targetUser) => {
      setActiveChatUser(targetUser);
      setActiveTab(3);
  };

  const handleAccept = async (reqId) => {
    await acceptRequest(reqId);
    setPendingReqs(p => p.filter(r => r.id !== reqId));
    // Re-fetch connections
    const accepts = await getAcceptedConnections(user.uid);
    setConnections(accepts);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Render Functions
  const renderHome = () => (
    <Stack spacing={4}>
      {/* Hero Banner */}
      <Box sx={{
        p: 6,
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.5px' }}>
            Welcome back, {user?.displayName.split(' ')[0]}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 500, lineHeight: 1.6 }}>
            Your network is expanding. You have {connections.length} active connections and {pendingReqs.length} new requests to review.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setActiveTab(1)}
            sx={{ 
                bgcolor: '#2563eb', 
                color: '#fff', 
                fontWeight: 700, 
                borderRadius: '10px',
                px: 3,
                py: 1.2,
                textTransform: 'none',
                '&:hover': { bgcolor: '#1d4ed8' } 
            }}
          >
            Explore Network
          </Button>
        </Box>
        <TrophyIcon sx={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          fontSize: '12rem',
          opacity: 0.08,
          color: '#fff'
        }} />
      </Box>

      {/* Suggested Peers from College */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 850 }}>Peers from {userCollege}</Typography>
          <Button endIcon={<ArrowIcon />} onClick={() => setActiveTab(1)}>View All</Button>
        </Stack>
        <Grid container spacing={3}>
          {peers.slice(0, 3).map((peer, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card className="premium-card">
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Avatar src={peer.photoURL} sx={{ width: 80, height: 80, mx: 'auto', mb: 2.5, border: '1px solid #f1f5f9' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>{peer.displayName}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>{peer.headline}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block', fontWeight: 500 }}>{peer.primaryCollege}</Typography>
                  <Box sx={{ mt: 'auto' }}>
                    {getConnectionStatus(peer.uid) === 'connected' ? (
                      <Button fullWidth variant="outlined" onClick={() => handleOpenChat(peer)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Message</Button>
                    ) : (
                      <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => handleConnect(peer.uid)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: '#0f172a' }}>Connect</Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {peers.length === 0 && !loading && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                <Typography variant="body1" sx={{ color: '#94a3b8' }}>No peers found yet. Invite your classmates!</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Pending Requests */}
      {pendingReqs.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 850, mb: 3 }}>Connection Requests</Typography>
          <Stack spacing={2}>
            {pendingReqs.map((req, i) => (
              <Paper key={i} sx={{ p: 2, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={req.senderInfo?.photoURL} />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{req.senderInfo?.displayName}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{req.senderInfo?.headline}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" size="small" onClick={() => handleAccept(req.id)} sx={{ bgcolor: '#10b981' }}>Accept</Button>
                  <Button variant="outlined" size="small" color="inherit">Ignore</Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );

  const renderDiscovery = () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 950, mb: 1 }}>Pulse Explorer</Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>Find and connect with talent from your institution and beyond.</Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
        <Chip
          label="All People"
          onClick={() => setDiscoveryFilter('all')}
          variant={discoveryFilter === 'all' ? 'filled' : 'outlined'}
          color={discoveryFilter === 'all' ? 'primary' : 'default'}
          sx={{ fontWeight: 700, borderRadius: '12px' }}
        />
        {userData?.primaryCollege && (
          <Chip
            label="My College"
            onClick={() => setDiscoveryFilter('college')}
            variant={discoveryFilter === 'college' ? 'filled' : 'outlined'}
            color={discoveryFilter === 'college' ? 'primary' : 'default'}
            sx={{ fontWeight: 700, borderRadius: '12px' }}
          />
        )}
        {userData?.currentCompany && (
          <Chip
            label="My Company"
            onClick={() => setDiscoveryFilter('company')}
            variant={discoveryFilter === 'company' ? 'filled' : 'outlined'}
            color={discoveryFilter === 'company' ? 'primary' : 'default'}
            sx={{ fontWeight: 700, borderRadius: '12px' }}
          />
        )}
      </Stack>

      <TextField
        placeholder="Search by name, role, or talent..."
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#64748b' }} />
            </InputAdornment>
          ),
          sx: { borderRadius: '20px', bgcolor: '#fff', py: 1 }
        }}
      />

      {discoveryLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {discoveryResults.map((peer, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card className="cute-card" sx={{ height: '100%', p: 1 }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar src={peer.photoURL} sx={{ width: 70, height: 70, border: '4px solid #f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#0f172a', letterSpacing: '-0.5px' }}>
                        {peer.displayName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {peer.headline}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    {peer.currentCompany && <Chip label={peer.currentCompany} size="small" sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: '#eff6ff', color: '#1d4ed8' }} />}
                    <Chip icon={<LocationIcon sx={{ fontSize: '0.8rem' }} />} label={peer.location || peer.primaryCollege?.split(' ')[0] || "Active"} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                    <Chip icon={<EducationIcon sx={{ fontSize: '0.8rem' }} />} label={peer.primaryCollege || "University"} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    {getConnectionStatus(peer.uid) === 'connected' ? (
                      <Button fullWidth variant="contained" startIcon={<ChatIcon />} onClick={() => handleOpenChat(peer)} sx={{ borderRadius: '12px' }}>Message</Button>
                    ) : getConnectionStatus(peer.uid) === 'sent' ? (
                      <Button fullWidth variant="outlined" color="warning" onClick={() => handleCancel(peer.uid)} sx={{ borderRadius: '12px' }}>Cancel Request</Button>
                    ) : getConnectionStatus(peer.uid) === 'pending' ? (
                      <Button fullWidth variant="contained" color="success" onClick={() => setActiveTab(0)} sx={{ borderRadius: '12px' }}>Review Request</Button>
                    ) : (
                      <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => handleConnect(peer.uid)} sx={{ borderRadius: '12px' }}>Connect</Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {discoveryResults.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '32px', bgcolor: '#fff' }}>
                <PeopleIcon sx={{ fontSize: '4rem', color: '#e2e8f0', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">No people found matching this filter.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Stack>
  );

  const renderNetwork = () => {
    // Advanced Stats Calculation
    const skillCounts = {};
    const companyCounts = {};
    const roleCounts = {};

    connections.forEach(c => {
      // Skills stats
      (c.skills || []).forEach(s => skillCounts[s] = (skillCounts[s] || 0) + 1);
      // Company stats
      if (c.currentCompany) companyCounts[c.currentCompany] = (companyCounts[c.currentCompany] || 0) + 1;
      // Role stats
      if (c.headline) {
          const role = c.headline.split('@')[0].trim();
          roleCounts[role] = (roleCounts[role] || 0) + 1;
      }
    });

    const skillData = Object.entries(skillCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({ subject: name, A: value, fullMark: connections.length }));

    const companyData = Object.entries(companyCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    const roleData = Object.entries(roleCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    return (
    <Stack spacing={4}>
      <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-1.5px', color: '#0f172a' }}>Network Intelligence</Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>A strategic view of your professional orbit.</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Skill Radar */}
        <Grid item xs={12} md={6}>
          <Paper className="premium-card" sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 4, letterSpacing: '-0.5px' }}>Skill Ecosystem</Typography>
            <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#94a3b8', mt: 2 }}>
                Dominant skills across your current network connections.
            </Typography>
          </Paper>
        </Grid>

        {/* Company Treemap */}
        <Grid item xs={12} md={6}>
          <Paper className="premium-card" sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 4, letterSpacing: '-0.5px' }}>Organization Distribution</Typography>
            <Box sx={{ flexGrow: 1, height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={companyData}
                  dataKey="value"
                  stroke="#fff"
                  fill="#1e293b"
                  content={<CustomTreemapContent />}
                />
              </ResponsiveContainer>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#94a3b8', mt: 2 }}>
                Top companies where your connections are currently active.
            </Typography>
          </Paper>
        </Grid>

        {/* Roles Distribution */}
        <Grid item xs={12}>
            <Paper className="premium-card" sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Career Identity Breakdown</Typography>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart layout="vertical" data={roleData} margin={{ left: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fontWeight: 700, fill: '#0f172a' }} axisLine={false} tickLine={false} />
                                <Bar dataKey="value" fill="#0f172a" radius={[0, 10, 10, 0]} barSize={25} />
                                <ChartTooltip />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2}>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <Typography variant="h5" sx={{ fontWeight: 950 }}>{connections.length}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Total Connections</Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <Typography variant="h5" sx={{ fontWeight: 950 }}>{Object.keys(companyCounts).length}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Unique Companies</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
      </Grid>
    </Stack>
  ); };

  const renderMessages = () => (
    <Stack direction="row" sx={{ height: '100%', borderRadius: { xs: 0, md: '0 0 0 0' }, overflow: 'hidden', bgcolor: '#fff', borderLeft: '1px solid #e2e8f0' }}>
      {/* Sidebar List */}
      <Box sx={{ width: { xs: 80, md: 360 }, borderRight: '1px solid #e2e8f0', p: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
        <Box sx={{ p: 2, display: { xs: 'none', md: 'block' } }}>
            <Typography variant="h5" sx={{ fontWeight: 950, color: '#1e293b' }}>Direct</Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>Connect & Orbit Ideas</Typography>
        </Box>
        <List sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
          {connections.map((conn, i) => (
            <ListItem
              button
              key={i}
              onClick={() => setActiveChatUser(conn)}
              selected={activeChatUser?.uid === conn.uid}
              sx={{ 
                borderRadius: '16px', 
                mb: 0.5, 
                p: { xs: 1, md: 1.5 },
                '&.Mui-selected': { bgcolor: 'rgba(16, 185, 129, 0.08)' }
              }}
            >
              <ListItemAvatar>
                <Badge color="success" variant="dot" overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                  <Avatar src={conn.photoURL} sx={{ width: 48, height: 48 }} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={conn.displayName}
                secondary={conn.headline}
                primaryTypographyProps={{ fontWeight: 800, sx: { display: { xs: 'none', md: 'block' }, fontSize: '0.95rem' } }}
                secondaryTypographyProps={{ sx: { display: { xs: 'none', md: 'block' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.75rem' } }}
              />
            </ListItem>
          ))}
          {connections.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <PeopleIcon sx={{ opacity: 0.1, fontSize: '3rem' }} />
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1, display: { xs: 'none', md: 'block' } }}>Connect with peers to start orbiting.</Typography>
            </Box>
          )}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f1f5f9' }}>
        {activeChatUser ? (
          <>
            {/* Header */}
            <Box sx={{ p: 2, px: 3, bgcolor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={activeChatUser.photoURL} sx={{ width: 44, height: 44 }} />
                <Box>
                  <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>{activeChatUser.displayName}</Typography>
                  <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>Orbiting Now</Typography>
                </Box>
              </Stack>
              <IconButton size="small"><StatsIcon fontSize="small" /></IconButton>
            </Box>

            {/* Messages body */}
            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
              {messages.map((m, idx) => {
                const isMe = m.senderId === user.uid;
                return (
                  <Fade in key={m.id || idx}>
                    <Box sx={{ 
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: { xs: '85%', md: '65%' },
                      p: 1.8,
                      px: 2.2,
                      borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      bgcolor: isMe ? '#10B981' : '#fff',
                      color: isMe ? '#fff' : '#1e293b',
                      boxShadow: isMe ? '0 4px 12px rgba(16,185,129,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>{m.text}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.6, fontSize: '0.6rem', textAlign: isMe ? 'right' : 'left', fontWeight: 600 }}>
                        {m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </Typography>
                    </Box>
                  </Fade>
                )
              })}
              {messages.length === 0 && (
                <Box sx={{ mt: 'auto', mb: 'auto', textAlign: 'center', p: 4 }}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'inline-flex', mb: 2 }}>
                    <ChatIcon sx={{ fontSize: '3rem', color: '#10B981' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Start Orbiting</Typography>
                  <Typography variant="body2" color="textSecondary">Send a message to ignite the conversation.</Typography>
                </Box>
              )}
            </Box>

            {/* Input area */}
            <Box sx={{ p: { xs: 2, md: 4 }, pt: 1, bgcolor: '#fff', borderTop: '1px solid #e2e8f0' }}>
              <Stack direction="row" spacing={2} sx={{ bgcolor: '#f8fafc', p: 0.5, borderRadius: '24px', pl: 2, border: '1px solid #e2e8f0' }}>
                <TextField
                  fullWidth
                  placeholder="Share a thought..."
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={messageText}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  onChange={(e) => setMessageText(e.target.value)}
                  sx={{ py: 1 }}
                />
                <IconButton 
                  color="primary" 
                  disabled={!messageText.trim()}
                  onClick={handleSendMessage} 
                  sx={{ 
                    bgcolor: messageText.trim() ? '#10B981' : '#e2e8f0', 
                    color: '#fff', 
                    '&:hover': { bgcolor: '#059669' },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Stack>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack alignItems="center" spacing={3} sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '40px', 
                bgcolor: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                animation: 'float 6s infinite ease-in-out'
              }}>
                <ChatIcon sx={{ fontSize: '4rem', color: '#10B981' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 950, color: '#0f172a', mb: 1 }}>College Orbit Direct</Typography>
                <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 400 }}>
                  Select a classmate or alumnus from the sidebar to launch a secure direct conversation.
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Dynamic Sidebar */}
      <Box sx={{
        width: { xs: 80, md: 280 },
        bgcolor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 900,
          color: '#0f172a',
          mb: 6,
          px: 1,
          letterSpacing: '-1px',
          display: { xs: 'none', md: 'block' }
        }}>
          College Connect<span style={{ color: '#2563eb' }}>.</span>
        </Typography>

        <Stack spacing={1} flexGrow={1}>
          {[
            { icon: <HomeIcon />, label: 'Home', color: '#0F172A' },
            { icon: <SearchIcon />, label: 'Discover', color: '#2563EB' },
            { icon: <StatsIcon />, label: 'Network', color: '#8B5CF6' },
            { icon: <ChatIcon />, label: 'Messages', color: '#10B981' }
          ].map((item, idx) => (
            <Button
              key={idx}
              fullWidth
              onClick={() => setActiveTab(idx)}
              sx={{
                justifyContent: { xs: 'center', md: 'flex-start' },
                py: 1.5,
                px: 2,
                mb: 1,
                borderRadius: '10px',
                color: activeTab === idx ? item.color : '#64748b',
                bgcolor: activeTab === idx ? `${item.color}08` : 'transparent',
                fontWeight: activeTab === idx ? 700 : 500,
                textTransform: 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: '#f8fafc',
                  color: item.color
                }
              }}
            >
              {item.icon}
              <Box sx={{ ml: 2, display: { xs: 'none', md: 'block' } }}>{item.label}</Box>
            </Button>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, display: { xs: 'none', md: 'flex' } }}>
          <Avatar src={user?.photoURL} sx={{ border: '2px solid #2563EB' }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.displayName}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>{userData?.year || "Active"}</Typography>
          </Box>
          <IconButton onClick={() => navigate('/profile')} sx={{ ml: 'auto' }} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ borderRadius: '12px', borderColor: '#fee2e2', color: '#ef4444' }}
        >
          <LogoutIcon sx={{ mr: { xs: 0, md: 1 } }} />
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>Logout</Box>
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        ml: { xs: '80px', md: '280px' }, 
        p: activeTab === 3 ? { xs: 0, md: 0 } : { xs: 3, md: 6 }, // No padding for chat tab
        width: { xs: 'calc(100% - 80px)', md: 'calc(100% - 280px)' },
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Fade in timeout={500}>
          <Box sx={{ 
            flexGrow: 1, 
            p: activeTab === 3 ? 0 : { xs: 1, md: 3 }, 
            height: activeTab === 3 ? '100vh' : 'auto' 
          }}>
            <Container maxWidth={activeTab === 3 ? "xl" : "lg"} sx={{ height: '100%', p: activeTab === 3 ? 0 : 2 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {activeTab === 0 && renderHome()}
                  {activeTab === 1 && renderDiscovery()}
                  {activeTab === 2 && renderNetwork()}
                  {activeTab === 3 && renderMessages()}
                </>
              )}
            </Container>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}
