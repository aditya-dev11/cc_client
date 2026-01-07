import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    CardMedia,
    MenuItem,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import MovieIcon from '@mui/icons-material/Movie';
import BookIcon from '@mui/icons-material/Book';
import AppsIcon from '@mui/icons-material/Apps';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import BusinessIcon from '@mui/icons-material/Business';
import api from '../../services/api';

const PORTFOLIO_TYPES = [
    { value: 'PROJECT', label: 'Project / Code', icon: <CodeIcon /> },
    { value: 'PUBLICATION', label: 'Writing / Publication', icon: <BookIcon /> },
    { value: 'PRODUCT', label: 'App / Game / Website', icon: <BusinessIcon /> },
    { value: 'MEDIA', label: 'Video / Content', icon: <MovieIcon /> },
    { value: 'DESIGN', label: 'Design / Art', icon: <DesignServicesIcon /> },
    { value: 'ACHIEVEMENT', label: 'Award / Achievement', icon: <EmojiEventsIcon /> },
    { value: 'OTHER', label: 'Other', icon: <AppsIcon /> }
];

const PortfolioEditor = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [newItem, setNewItem] = useState({
        title: '',
        type: 'OTHER',
        role: '',
        url: '',
        iframeUrl: '',
        description: '',
        imageUrl: ''
    });

    const fetchPortfolio = async () => {
        try {
            setLoading(true);
            const res = await api.get('/portfolio/me');
            setItems(res.data);
        } catch (err) {
            console.error("Failed to fetch portfolio", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const handleChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleOpen = () => {
        setNewItem({ title: '', type: 'OTHER', role: '', url: '', iframeUrl: '', description: '', imageUrl: '' });
        setEditMode(false);
        setEditingId(null);
        setOpen(true);
    };

    const handleEdit = (item) => {
        setNewItem({
            title: item.title,
            type: item.type,
            role: item.role || '',
            url: item.url || '',
            iframeUrl: item.iframeUrl || '',
            description: item.description || '',
            imageUrl: item.imageUrl || ''
        });
        setEditMode(true);
        setEditingId(item.id);
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editMode && editingId) {
                await api.put(`/portfolio/${editingId}`, newItem);
            } else {
                await api.post('/portfolio', newItem);
            }
            setOpen(false);
            fetchPortfolio();
        } catch (err) {
            console.error("Failed to save portfolio item", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await api.delete(`/portfolio/${id}`);
            fetchPortfolio();
        } catch (err) {
            console.error("Failed to delete item", err);
        }
    };

    const getIcon = (type) => {
        const found = PORTFOLIO_TYPES.find(t => t.value === type);
        return found ? found.icon : <AppsIcon />;
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Portfolio & Creative Works</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpen}>
                    Add Project
                </Button>
            </Box>

            <Grid container spacing={3}>
                {items.map((item) => (
                    <Grid item xs={12} md={6} key={item.id}>
                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {item.imageUrl && (
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={item.imageUrl}
                                    alt={item.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        {getIcon(item.type)}
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {PORTFOLIO_TYPES.find(t => t.value === item.type)?.label}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleEdit(item)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                                {item.role && (
                                    <Chip label={item.role} size="small" sx={{ mb: 1, fontWeight: 500 }} />
                                )}
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                                    {item.description}
                                </Typography>

                                {item.type === 'MEDIA' && item.url && item.url.includes('youtube') && (
                                    <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'black', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${item.url.split('v=')[1]?.split('&')[0]}`}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                            allowFullScreen
                                            title={item.title}
                                        />
                                    </Box>
                                )}

                                {['PRODUCT', 'MEDIA', 'PROJECT', 'DESIGN'].includes(item.type) && item.iframeUrl && (
                                    <Box sx={{ mt: 2 }}>
                                        <Button variant="outlined" size="small" fullWidth onClick={() => window.open(item.iframeUrl, '_blank')}>
                                            Launch / Play
                                        </Button>
                                        <Typography variant="caption" display="block" align="center" sx={{ mt: 0.5 }}>
                                            (Opens in new tab)
                                        </Typography>
                                    </Box>
                                )}

                                {!item.iframeUrl && item.url && (
                                    <Button variant="text" size="small" href={item.url} target="_blank" rel="noopener noreferrer">
                                        View Project
                                    </Button>
                                )}

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {items.length === 0 && (
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4, fontStyle: 'italic' }}>
                            No portfolio items added yet. Showcase your creativity!
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Editor Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            select
                            label="Category / Type"
                            name="type"
                            value={newItem.type}
                            onChange={handleChange}
                            fullWidth
                        >
                            {PORTFOLIO_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Title"
                            name="title"
                            value={newItem.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Role (e.g. Author, Director, Lead Dev)"
                            name="role"
                            value={newItem.role}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Thumbnail Image URL"
                            name="imageUrl"
                            value={newItem.imageUrl}
                            onChange={handleChange}
                            fullWidth
                            helperText="Direct link to an image (JPG/PNG) to display as card cover."
                        />

                        <TextField
                            label="Main Link (URL)"
                            name="url"
                            value={newItem.url}
                            onChange={handleChange}
                            fullWidth
                            helperText="Link to the work (e.g. GitHub, YouTube, Article)"
                        />

                        {['PRODUCT', 'MEDIA', 'PROJECT', 'DESIGN'].includes(newItem.type) && (
                            <TextField
                                label="Embed URL (Iframe)"
                                name="iframeUrl"
                                value={newItem.iframeUrl}
                                onChange={handleChange}
                                fullWidth
                                helperText="Optional: Link to embed/play content directly"
                            />
                        )}

                        <TextField
                            label="Description"
                            name="description"
                            value={newItem.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Describe your work, tools used, impact, etc."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PortfolioEditor;
