import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/Feed/PostCard';
import CreatePost from '../components/Feed/CreatePost';

const FeedPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch feed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/posts/${postId}/like`);
            const { isLiked, likesCount } = response.data;

            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId
                        ? { ...post, isLiked, likesCount }
                        : post
                )
            );
        } catch (error) {
            console.error('Like failed', error);
        }
    };

    const handleCommentClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" disableGutters sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 600, borderLeft: '1px solid #EFF3F4', borderRight: '1px solid #EFF3F4' }}>
                <Box sx={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #EFF3F4', px: 2, py: 1.5 }}>
                    <Typography variant="h6" fontWeight="bold">Home</Typography>
                </Box>

                <CreatePost onPostCreated={handlePostCreated} />

                <Box>
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={handleLike}
                            onComment={handleCommentClick}
                        />
                    ))}
                    {posts.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No posts yet. Be the first to tweet!</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default FeedPage;
