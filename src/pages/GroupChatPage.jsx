import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Avatar, TextField, IconButton, CircularProgress, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { sendGroupMessage, getGroupInfo, getGroupMembers } from '../services/firestoreService';

const GroupChatPage = () => {
    const { user } = useAuth();
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [members, setMembers] = useState({});
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!groupId || !user) return;

        const loadInitialData = async () => {
            try {
                const groupData = await getGroupInfo(groupId);
                setGroup(groupData);

                const membersData = await getGroupMembers(groupId);
                const memMap = {};
                for (const m of membersData) {
                    memMap[m.userId] = m.profile;
                }
                setMembers(memMap);
            } catch (error) {
                console.error("Failed to load group", error);
            }
        };

        loadInitialData();

        // Listen for new messages
        const messagesRef = collection(db, 'groups', groupId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [groupId, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !groupId) return;

        const text = newMessage;
        setNewMessage('');
        try {
            await sendGroupMessage(groupId, user.id || user.uid, text);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message.");
        }
    };

    if (loading || !group) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: { xs: 'calc(100vh - 56px)', md: '100vh' }, display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
            <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', borderRadius: 0 }}>
                <IconButton onClick={() => navigate('/groups')} sx={{ mr: 1, color: '#455A64' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: '#FF385C' }}>
                    {group.name[0]}
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="800">
                        {group.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {Object.keys(members).length} members
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#f7f7f7' }}>
                {messages.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                        Say hi to the group! This is the beginning of your conversation.
                    </Typography>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId === (user.id || user.uid);
                        const senderProfile = members[msg.senderId];
                        return (
                            <Box
                                key={msg.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                {!isMine && (
                                    <Avatar src={senderProfile?.profilePicture} sx={{ width: 32, height: 32, mr: 1, mt: 'auto', mb: 0.5 }}>
                                        {senderProfile?.displayName?.[0] || '?'}
                                    </Avatar>
                                )}
                                <Box sx={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                                    {!isMine && (
                                        <Typography variant="caption" sx={{ ml: 1, mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
                                            {senderProfile?.displayName?.split(' ')[0] || 'Unknown'}
                                        </Typography>
                                    )}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            px: 3,
                                            bgcolor: isMine ? '#FF385C' : '#fff',
                                            color: isMine ? '#fff' : '#222',
                                            borderRadius: isMine ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                            border: isMine ? 'none' : '1px solid #e0e0e0'
                                        }}
                                    >
                                        <Typography variant="body1">{msg.text}</Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            <Paper component="form" onSubmit={handleSendMessage} elevation={0} sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', borderRadius: 0 }}>
                <TextField
                    fullWidth
                    placeholder="Message the group..."
                    variant="outlined"
                    size="small"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '30px',
                            bgcolor: '#f1f1f1',
                            '& fieldset': { border: 'none' }
                        }
                    }}
                />
                <IconButton type="submit" color="primary" disabled={!newMessage.trim()} sx={{ ml: 1, color: '#FF385C' }}>
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default GroupChatPage;
