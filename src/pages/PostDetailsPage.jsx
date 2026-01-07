import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    IconButton,
    Divider,
    Stack,
    Avatar,
    TextField,
    Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/Feed/PostCard';

const PostDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPostAndComments();
    }, [id]);

    const fetchPostAndComments = async () => {
        setLoading(true);
        try {
            const [postRes, commentsRes] = await Promise.all([
                api.get(`/posts/${id}`),
                api.get(`/posts/${id}/comments`)
            ]);
            setPost(postRes.data);
            setComments(commentsRes.data);
        } catch (error) {
            console.error('Failed to fetch post details', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/posts/${postId}/like`);
            const { isLiked, likesCount } = response.data;
            setPost(prev => ({ ...prev, isLiked, likesCount }));
        } catch (error) {
            console.error('Like failed', error);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await api.post(`/posts/${id}/comments`, { content: newComment });
            setComments([...comments, response.data]);
            setPost(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>Post not found</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" disableGutters sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', borderLeft: '1px solid #EFF3F4', borderRight: '1px solid #EFF3F4', minHeight: '100vh' }}>

                {/* Header */}
                <Box sx={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #EFF3F4', px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, color: 'black' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight="bold">Post</Typography>
                </Box>

                {/* Main Post */}
                <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={() => { }} // Already on details page, so no-op or focus input
                />

                {/* Comment Input */}
                <Box sx={{ p: 2, borderBottom: '1px solid #EFF3F4' }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                            src={user?.profilePictureUrl}
                            sx={{ width: 40, height: 40 }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Post your reply"
                                multiline
                                variant="standard"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    style: { fontSize: '1.2rem' }
                                }}
                                sx={{ mb: 1 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    disabled={!newComment.trim() || submitting}
                                    onClick={handleSubmitComment}
                                    sx={{
                                        borderRadius: 9999,
                                        backgroundColor: '#ff385c',
                                        color: 'white',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        px: 3,
                                        '&:hover': { backgroundColor: '#d90b3e' }
                                    }}
                                >
                                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Reply'}
                                </Button>
                            </Box>
                        </Box>
                    </Stack>
                </Box>

                {/* Visual Separator */}
                <Box sx={{ height: 6, backgroundColor: '#F7F9F9', borderBottom: '1px solid #EFF3F4' }} />

                {/* Comments List */}
                <Box>
                    <Box sx={{ p: 2, pb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Comments
                        </Typography>
                    </Box>
                    <Divider />
                    {comments.map(comment => (
                        <Box key={comment.id} sx={{ p: 2, borderBottom: '1px solid #EFF3F4', '&:hover': { backgroundColor: '#F7F9F9' } }}>
                            <Stack direction="row" spacing={2}>
                                <Avatar
                                    src={comment.User?.Profile?.profilePictureUrl}
                                    alt={comment.User?.username}
                                    sx={{ width: 40, height: 40, cursor: 'pointer' }}
                                    onClick={() => navigate(`/profile/${comment.User?.username}`)}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{ mr: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                            onClick={() => navigate(`/profile/${comment.User?.username}`)}
                                        >
                                            {comment.User?.Profile?.fullName || comment.User?.username}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            @{comment.User?.username} · {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }).replace('about ', '')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {comment.content}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    ))}
                    {comments.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No comments yet.</Typography>
                        </Box>
                    )}
                </Box>

            </Box>
        </Container>
    );
};

export default PostDetailsPage;
