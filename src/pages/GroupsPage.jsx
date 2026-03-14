import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Container, Paper, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Select,
    MenuItem, FormControl, InputLabel, CircularProgress, IconButton, Avatar, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/ChatRounded';
import ShareIcon from '@mui/icons-material/Share';

import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { createGroup, getUserGroups, getGroupMembers } from '../services/firestoreService';
import { useNavigate } from 'react-router-dom';

// Simple SVG Icons for visualizations
const SVGPerson = ({ color = "#FF385C", size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

const SVGDesk = ({ size = 60 }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 60 40" fill="#8D6E63" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="50" height="8" rx="2" />
        <rect x="10" y="18" width="6" height="22" />
        <rect x="44" y="18" width="6" height="22" />
    </svg>
);

const GroupsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', type: 'CLASS', privacyMode: 'PUBLIC' });
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    useEffect(() => {
        if (user) {
            loadGroups();
        }
    }, [user]);

    const loadGroups = async () => {
        setLoading(true);
        try {
            const userGroups = await getUserGroups(user.id || user.uid);
            setGroups(userGroups);
            if (userGroups.length > 0 && !selectedGroup) {
                handleSelectGroup(userGroups[0]);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleCreateGroup = async () => {
        if (!newGroup.name) return;
        try {
            const groupId = await createGroup(newGroup, user.id || user.uid);
            await loadGroups();
            setOpenCreate(false);
            setNewGroup({ name: '', description: '', type: 'CLASS', privacyMode: 'PUBLIC' });
        } catch (err) {
            console.error(err);
            alert("Failed to create group");
        }
    };

    const handleSelectGroup = async (group) => {
        setSelectedGroup(group);
        setLoadingMembers(true);
        try {
            const groupMembers = await getGroupMembers(group.id);
            setMembers(groupMembers);
        } catch (err) {
            console.error(err);
        }
        setLoadingMembers(false);
    };

    const startGroupChat = () => {
        navigate(`/groups/${selectedGroup.id}/chat`);
    };

    const copyInviteLink = () => {
        const link = `${window.location.origin}/groups/join/${selectedGroup.id}`;
        navigator.clipboard.writeText(link);
        alert('Invite link copied to clipboard!');
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
    }

    // Visualization Renderer
    const renderVisualization = () => {
        if (!selectedGroup) return null;

        return (
            <Box sx={{ p: 4, minHeight: 400, bgcolor: '#f0f2f5', borderRadius: 4, position: 'relative', overflow: 'hidden', mt: 2 }}>
                <Typography variant="h6" sx={{ color: '#555', mb: 2, textAlign: 'center' }}>
                    {selectedGroup.type === 'CLASS' ? 'Classroom View' : selectedGroup.type === 'WORK' ? 'Office View' : 'Family View'}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, mt: 4 }}>
                    {members.map((member, idx) => (
                        <Box key={member.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Tooltip title={`${member.profile?.displayName || member.profile?.username} (${member.role})`}>
                                <Box sx={{ position: 'relative', cursor: 'pointer', '&:hover': { transform: 'scale(1.1)', transition: 'transform 0.2s' } }}>
                                    {member.profile?.profilePicture ? (
                                        <Avatar src={member.profile.profilePicture} sx={{ width: 48, height: 48, border: '3px solid #FF385C', mb: 1, zIndex: 2, position: 'relative' }} />
                                    ) : (
                                        <Box sx={{ mb: 1, zIndex: 2, position: 'relative' }}><SVGPerson color={member.role === 'ADMIN' ? '#FF9800' : '#FF385C'} size={48} /></Box>
                                    )}

                                    {/* Props based on type */}
                                    {selectedGroup.type === 'CLASS' && (
                                        <Box sx={{ position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
                                            <SVGDesk size={60} />
                                        </Box>
                                    )}
                                    {selectedGroup.type === 'WORK' && (
                                        <Box sx={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
                                            <svg width="40" height="20" viewBox="0 0 40 20" fill="#455A64"><rect x="0" y="15" width="40" height="5" /><rect x="15" y="0" width="10" height="15" /></svg>
                                        </Box>
                                    )}
                                </Box>
                            </Tooltip>

                            <Typography variant="caption" sx={{ mt: selectedGroup.type === 'CLASS' ? 2 : 1, fontWeight: 700, bgcolor: 'rgba(255,255,255,0.7)', px: 1, borderRadius: 1 }}>
                                {member.profile?.displayName?.split(' ')[0] || member.profile?.username}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff', p: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#222' }}>
                        My Groups
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                        sx={{ bgcolor: '#FF385C', borderRadius: 4, px: 3 }}
                    >
                        Create Group
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Group List Sidebar */}
                    <Box sx={{ width: { xs: '100%', md: 300 } }}>
                        {groups.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#f9f9f9', border: '1px dashed #ccc' }}>
                                <Typography color="text.secondary">You are not in any groups yet.</Typography>
                            </Paper>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {groups.map(g => (
                                    <Paper
                                        key={g.id}
                                        elevation={selectedGroup?.id === g.id ? 4 : 0}
                                        onClick={() => handleSelectGroup(g)}
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            cursor: 'pointer',
                                            border: selectedGroup?.id === g.id ? '2px solid #FF385C' : '1px solid #e0e0e0',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="700">{g.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{g.type} • {g.privacyMode}</Typography>
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Group Detail Area */}
                    {selectedGroup && (
                        <Box sx={{ flex: 1 }}>
                            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #eee', mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h4" fontWeight="800">{selectedGroup.name}</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{selectedGroup.description}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            startIcon={<ShareIcon />}
                                            onClick={copyInviteLink}
                                            sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Share Link
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<ChatIcon />}
                                            onClick={startGroupChat}
                                            sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 700, bgcolor: '#FF385C', color: 'white' }}
                                        >
                                            Group Chat
                                        </Button>
                                    </Box>
                                </Box>

                                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, color: '#FF385C', fontWeight: 800 }}>
                                    MEMBER VISUALIZATION
                                </Typography>

                                {loadingMembers ? <CircularProgress /> : renderVisualization()}

                            </Paper>
                        </Box>
                    )}
                </Box>
            </Container>

            {/* Create Group Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Create New Group</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Group Name"
                        fullWidth
                        variant="outlined"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                        sx={{ mb: 3 }}
                    />
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Group Type</InputLabel>
                        <Select
                            value={newGroup.type}
                            label="Group Type"
                            onChange={(e) => setNewGroup({ ...newGroup, type: e.target.value })}
                        >
                            <MenuItem value="CLASS">Classroom / College</MenuItem>
                            <MenuItem value="WORK">Workplace / Office</MenuItem>
                            <MenuItem value="FAMILY">Family / Gathering</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Privacy</InputLabel>
                        <Select
                            value={newGroup.privacyMode}
                            label="Privacy"
                            onChange={(e) => setNewGroup({ ...newGroup, privacyMode: e.target.value })}
                        >
                            <MenuItem value="PUBLIC">Public</MenuItem>
                            <MenuItem value="PRIVATE">Private</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                    <Button onClick={handleCreateGroup} variant="contained" sx={{ bgcolor: '#FF385C' }} disabled={!newGroup.name}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GroupsPage;
