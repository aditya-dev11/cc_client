import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button, CircularProgress, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getGroupInfo, getGroupMembers, addGroupMember } from '../services/firestoreService';
import PeopleIcon from '@mui/icons-material/PeopleRounded';

const GroupJoinPage = () => {
    const { user } = useAuth();
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const checkMembership = async () => {
            if (!groupId || !user) return;
            try {
                const groupData = await getGroupInfo(groupId);
                if (!groupData) {
                    setLoading(false);
                    return; // Will show "Not Found" UI below
                }
                setGroup(groupData);

                const members = await getGroupMembers(groupId);
                const isUserInGroup = members.some(m => m.userId === (user.id || user.uid));
                setIsMember(isUserInGroup);
            } catch (err) {
                console.error("Error retrieving group:", err);
            }
            setLoading(false);
        };

        checkMembership();
    }, [groupId, user]);

    const handleJoinGroup = async () => {
        setJoining(true);
        try {
            await addGroupMember(groupId, user.id || user.uid);
            navigate(`/groups`); // Redirect to groups overview after joining
        } catch (err) {
            console.error("Failed to join group:", err);
            alert("Failed to join group.");
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!group) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" color="text.secondary">Group not found or link is invalid.</Typography>
                <Button onClick={() => navigate('/groups')} sx={{ mt: 2 }}>Back to Groups</Button>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid #e0e0e0', textAlign: 'center', width: '100%' }}>
                    <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, bgcolor: '#FF385C' }}>
                        <PeopleIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        {group.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {group.description || 'You have been invited to join this group!'}
                    </Typography>

                    {isMember ? (
                        <Box>
                            <Typography sx={{ color: '#2E7D32', fontWeight: 600, mb: 2 }}>You are already a member! 🎉</Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/groups')}
                                sx={{ borderRadius: 8, bgcolor: '#222', px: 4, py: 1.5 }}
                            >
                                Go to My Groups
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            disabled={joining}
                            onClick={handleJoinGroup}
                            sx={{ borderRadius: 8, bgcolor: '#FF385C', color: 'white', px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#E31C5F' } }}
                        >
                            {joining ? 'Joining...' : 'Join Group'}
                        </Button>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default GroupJoinPage;
