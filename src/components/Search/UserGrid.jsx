import React from 'react';
import {
    Grid,
    Card,
    Link as MuiLink,
    Box,
    CardMedia,
    Typography,
    Chip,
    CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';

const UserGrid = ({ users }) => {
    return (
        <Grid container spacing={2}>
            {users.map((user) => {
                // Helper to get initials
                const getInitials = () => {
                    const nameToUse = user.displayName || user.username || '?';
                    const names = nameToUse.trim().split(' ');
                    if (names.length >= 2) {
                        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
                    }
                    return nameToUse.slice(0, 2).toUpperCase();
                };

                return (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={user.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            elevation={0}
                            sx={{
                                width: 200,
                                height: '100%',
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                border: '1px solid #f0f2f5',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }
                            }}
                        >
                            <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0', height: 140, bgcolor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {user.profilePicture ? (
                                        <CardMedia
                                            component="img"
                                            image={user.profilePicture}
                                            alt={user.username}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 800, opacity: 0.9, fontSize: '2.5rem' }}>
                                            {getInitials()}
                                        </Typography>
                                    )}
                                </Box>

                                <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="700"
                                        sx={{
                                            color: '#111b21',
                                            fontSize: '0.85rem',
                                            mb: 0.2,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: '100%',
                                            display: 'block'
                                        }}
                                    >
                                        {user.displayName || user.username || 'Unknown User'}
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.7rem', mb: 0.5 }}>
                                        {user.headline || 'No Headline'}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default UserGrid;
