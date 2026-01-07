import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Typography,
    IconButton,
    CardMedia,
    Box,
    Button
} from '@mui/material';
import {
    ChatBubbleOutline as CommentIcon,
    FavoriteBorder as LikeIcon,
    Favorite as LikedIcon,
    Share as ShareIcon,
    Event as EventIcon,
    EmojiEvents as AchievementIcon,
    Code as CodeIcon,
    SportsEsports as SportsIcon,
    Psychology as ResearchIcon,
    School as CertificateIcon,
    Work as InternshipIcon,
    BusinessCenter as JobIcon,
    RocketLaunch as ProjectIcon,
    Public as LeadershipIcon,
    Palette as ArtsIcon
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ACHIEVEMENT_ICONS = {
    'Job / Placement': <JobIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Internship': <InternshipIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Hackathon / Tech': <CodeIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Sports Victory': <SportsIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Cultural / Arts': <ArtsIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Research / Paper': <ResearchIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Project / Startup': <ProjectIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Certification': <CertificateIcon sx={{ mr: 1, color: '#00BA7C' }} />,
    'Leadership Role': <LeadershipIcon sx={{ mr: 1, color: '#00BA7C' }} />
};

const PostCard = ({ post, onLike, onComment }) => {
    const navigate = useNavigate();
    const { User, content, mediaUrl, likesCount, commentsCount, isLiked, createdAt, category, eventStartDate, eventEndDate, achievementType, gamificationPoints, careerType } = post;

    const handleLike = (e) => {
        e.stopPropagation();
        onLike(post.id);
    };

    const handleComment = (e) => {
        e.stopPropagation();
        onComment(post.id);
    };

    return (
        <Box
            onClick={() => navigate(`/post/${post.id}`)}
            sx={{
                p: 2,
                borderBottom: '1px solid #EFF3F4',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)'
                }
            }}
        >
            <Box sx={{ display: 'flex' }}>
                <Avatar
                    src={User?.Profile?.profilePictureUrl}
                    alt={User?.username}
                    sx={{ mr: 1.5, width: 40, height: 40, cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${User?.username}`);
                    }}
                />

                <Box sx={{ flex: 1 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 'bold',
                                mr: 0.5,
                                lineHeight: '1.25',
                                color: '#0f1419',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${User?.username}`);
                            }}
                        >
                            {User?.Profile?.fullName || User?.username}
                        </Typography>
                        <Typography variant="body2" color="#536471" sx={{ mr: 0.5 }}>
                            @{User?.username}
                        </Typography>
                        <Typography variant="body2" color="#536471">
                            · {formatDistanceToNow(new Date(createdAt), { addSuffix: true }).replace('about ', '').replace('less than a minute ago', '1m')}
                        </Typography>

                        {category && category !== 'GENERAL' && category !== 'CAREER_UPDATE' && (
                            <Box
                                sx={{
                                    ml: 'auto',
                                    color: '#536471',
                                    backgroundColor: '#EFF3F4',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 4,
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                {category}
                            </Box>
                        )}
                    </Box>

                    {/* Content */}
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 1.5,
                            whiteSpace: 'pre-wrap',
                            color: '#0f1419',
                            fontSize: '15px',
                            lineHeight: '20px'
                        }}
                    >
                        {content}
                    </Typography>

                    {/* Event Info */}
                    {category === 'EVENT' && eventStartDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: '#536471', border: '1px solid #CFD9DE', borderRadius: 3, p: 1.5 }}>
                            <EventIcon sx={{ mr: 1, color: '#F91880' }} />
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: '#0f1419', fontWeight: 'bold' }}>
                                    {format(new Date(eventStartDate), 'EEE, MMM d, yyyy • h:mm a')}
                                </Typography>
                                {eventEndDate && (
                                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                        to {format(new Date(eventEndDate), 'EEE, MMM d, yyyy • h:mm a')}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Achievement Info */}
                    {category === 'ACHIEVEMENT' && achievementType && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: '#536471', backgroundColor: 'rgba(0, 186, 124, 0.1)', borderRadius: 3, p: 1.5 }}>
                            {ACHIEVEMENT_ICONS[achievementType] || <AchievementIcon sx={{ mr: 1, color: '#00BA7C' }} />}
                            <Typography variant="subtitle2" sx={{ color: '#00BA7C', fontWeight: 'bold' }}>
                                {achievementType}
                            </Typography>
                        </Box>
                    )}

                    {category === 'CAREER_UPDATE' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: '#1D9BF0', backgroundColor: 'rgba(29, 155, 240, 0.1)', borderRadius: 3, p: 1.5 }}>
                            <JobIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {careerType || 'Career Update'}
                            </Typography>
                        </Box>
                    )}

                    {/* Media */}
                    {mediaUrl && (
                        <Box
                            component="img"
                            src={mediaUrl}
                            alt="Post media"
                            sx={{
                                width: '100%',
                                borderRadius: 4,
                                maxHeight: 500,
                                objectFit: 'cover',
                                border: '1px solid #CFD9DE',
                                mb: 1.5
                            }}
                        />
                    )}

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 425, mt: 0.5 }}>

                        {/* Comment Action */}
                        <Box sx={{ display: 'flex', alignItems: 'center', group: 'group' }}>
                            <IconButton
                                size="small"
                                onClick={handleComment}
                                sx={{
                                    color: '#536471',
                                    p: 1,
                                    '&:hover': { color: '#1D9BF0', backgroundColor: 'rgba(29, 155, 240, 0.1)' }
                                }}
                            >
                                <CommentIcon fontSize="small" sx={{ fontSize: '18px' }} />
                            </IconButton>
                            {commentsCount > 0 && (
                                <Typography variant="caption" sx={{ ml: 0.5, color: '#536471' }}>
                                    {commentsCount}
                                </Typography>
                            )}
                        </Box>

                        {/* Like Action */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                size="small"
                                onClick={handleLike}
                                sx={{
                                    color: isLiked ? '#F91880' : '#536471',
                                    p: 1,
                                    '&:hover': { color: '#F91880', backgroundColor: 'rgba(249, 24, 128, 0.1)' }
                                }}
                            >
                                {isLiked ? <LikedIcon fontSize="small" sx={{ fontSize: '18px' }} /> : <LikeIcon fontSize="small" sx={{ fontSize: '18px' }} />}
                            </IconButton>
                            {likesCount > 0 && (
                                <Typography variant="caption" sx={{ ml: 0.5, color: isLiked ? '#F91880' : '#536471' }}>
                                    {likesCount}
                                </Typography>
                            )}
                        </Box>

                        {/* Share Action (Visual Only) */}
                        <IconButton
                            size="small"
                            sx={{
                                color: '#536471',
                                p: 1,
                                '&:hover': { color: '#1D9BF0', backgroundColor: 'rgba(29, 155, 240, 0.1)' }
                            }}
                        >
                            <ShareIcon fontSize="small" sx={{ fontSize: '18px' }} />
                        </IconButton>

                        {/* Spacer for 4th column alignment if needed */}
                        <Box sx={{ width: 20 }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PostCard;
