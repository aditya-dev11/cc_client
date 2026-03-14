import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Container, Paper, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, TextField, IconButton,
    Divider, CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { sendMessage } from '../services/firestoreService';

const ChatsPage = () => {
    const { user } = useAuth();
    const { chatId } = useParams();
    const navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatProfiles, setChatProfiles] = useState({});
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch user's chats
    useEffect(() => {
        if (!user) return;

        // Listen to chats where the user is a participant
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', user.id || user.uid), orderBy('lastMessageTime', 'desc'));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const chatList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChats(chatList);
            setLoadingChats(false);

            // Fetch profiles for the other participants
            const profilesMap = { ...chatProfiles };
            let newProfilesFound = false;

            for (const chat of chatList) {
                const otherUserId = chat.participants.find(p => p !== (user.id || user.uid));
                if (otherUserId && !profilesMap[otherUserId]) {
                    // fetch user profile directly here or use a helper
                    const usersRef = collection(db, 'users');
                    const pQuery = query(usersRef, where('__name__', '==', otherUserId));
                    const pSnapshot = await getDocs(pQuery);
                    if (!pSnapshot.empty) {
                        profilesMap[otherUserId] = pSnapshot.docs[0].data();
                        newProfilesFound = true;
                    }
                }
            }

            if (newProfilesFound) {
                setChatProfiles(profilesMap);
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Read messages for selected chat
    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            return;
        }
        setLoadingMessages(true);
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoadingMessages(false);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId || !user) return;

        const text = newMessage;
        setNewMessage('');
        try {
            await sendMessage(chatId, user.id || user.uid, text);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message.");
        }
    };

    const currentChat = chats.find(c => c.id === chatId);
    let otherParticipantProfile = null;
    if (currentChat && user) {
        const otherId = currentChat.participants.find(p => p !== (user.id || user.uid));
        otherParticipantProfile = chatProfiles[otherId];
    }

    if (loadingChats) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: { xs: 'calc(100vh - 56px)', md: '100vh' }, display: 'flex', bgcolor: '#fff' }}>
            {/* Sidebar - Chat List */}
            <Box
                sx={{
                    width: { xs: chatId ? 0 : '100%', md: 350 },
                    display: { xs: chatId ? 'none' : 'block', md: 'block' },
                    borderRight: '1px solid #e0e0e0',
                    overflowY: 'auto'
                }}
            >
                <Typography variant="h5" fontWeight="800" sx={{ p: 3, pb: 2 }}>
                    Messages
                </Typography>
                <List sx={{ p: 0 }}>
                    {chats.length === 0 ? (
                        <Typography sx={{ p: 3, color: 'text.secondary', textAlign: 'center' }}>No conversations yet.</Typography>
                    ) : (
                        chats.map((chat) => {
                            const otherId = chat.participants.find(p => p !== (user.id || user.uid));
                            const profile = chatProfiles[otherId];
                            const isSelected = chat.id === chatId;

                            return (
                                <ListItem
                                    key={chat.id}
                                    button
                                    onClick={() => navigate(`/chats/${chat.id}`)}
                                    sx={{
                                        bgcolor: isSelected ? 'rgba(0,0,0,0.04)' : 'transparent',
                                        borderLeft: isSelected ? '4px solid #FF385C' : '4px solid transparent', // Manam/Airbnb accent
                                        px: 3, py: 2
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={profile?.profilePicture}>
                                            {profile?.displayName?.[0] || profile?.username?.[0] || '?'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight="700">
                                                {profile?.displayName || profile?.username || 'Unknown User'}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                                {chat.lastMessage || 'Start a conversation'}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            );
                        })
                    )}
                </List>
            </Box>

            {/* Main Chat Area */}
            {chatId ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Chat Header */}
                    <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', borderRadius: 0 }}>
                        <IconButton sx={{ display: { md: 'none' }, mr: 1 }} onClick={() => navigate('/chats')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Avatar src={otherParticipantProfile?.profilePicture} sx={{ width: 40, height: 40, mr: 2 }}>
                            {otherParticipantProfile?.displayName?.[0] || otherParticipantProfile?.username?.[0] || '?'}
                        </Avatar>
                        <Typography variant="h6" fontWeight="700">
                            {otherParticipantProfile?.displayName || otherParticipantProfile?.username || 'Loading...'}
                        </Typography>
                    </Paper>

                    {/* Messages */}
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#f7f7f7' }}>
                        {loadingMessages ? (
                            <CircularProgress sx={{ alignSelf: 'center', mt: 4 }} />
                        ) : messages.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                                Say hi! This is the beginning of your conversation.
                            </Typography>
                        ) : (
                            messages.map((msg) => {
                                const isMine = msg.senderId === (user.id || user.uid);
                                return (
                                    <Box
                                        key={msg.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isMine ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                px: 3,
                                                maxWidth: '70%',
                                                bgcolor: isMine ? '#FF385C' : '#fff', // Sender gets primary color
                                                color: isMine ? '#fff' : '#222',
                                                borderRadius: isMine ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                                border: isMine ? 'none' : '1px solid #e0e0e0'
                                            }}
                                        >
                                            <Typography variant="body1">{msg.text}</Typography>
                                        </Paper>
                                    </Box>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Paper component="form" onSubmit={handleSendMessage} elevation={0} sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', borderRadius: 0 }}>
                        <TextField
                            fullWidth
                            placeholder="Type a message..."
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
            ) : (
                <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                    <Typography variant="h5" fontWeight="700" color="text.secondary">Select a conversation</Typography>
                    <Typography variant="body1" color="text.disabled">Choose a chat from the menu to start messaging</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ChatsPage;
