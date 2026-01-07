import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Chip,
    FormControlLabel,
    Switch,
    TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';

const SkillList = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        isTechnical: true,
        iconUrl: ''
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedSkills = skills.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super/skills');
            setSkills(res.data);
        } catch (err) {
            setError('Failed to fetch skills');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleOpenDialog = (skill = null) => {
        if (skill) {
            setEditingSkill(skill);
            setFormData({
                name: skill.name,
                category: skill.category || '',
                description: skill.description || '',
                isTechnical: skill.isTechnical !== undefined ? skill.isTechnical : true,
                iconUrl: skill.iconUrl || ''
            });
        } else {
            setEditingSkill(null);
            setFormData({
                name: '',
                category: '',
                description: '',
                isTechnical: true,
                iconUrl: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSkill(null);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            if (editingSkill) {
                await api.put(`/super/skills/${editingSkill.id}`, formData);
            } else {
                await api.post('/super/skills', formData);
            }
            fetchSkills();
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to save skill');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this skill?')) {
            try {
                await api.delete(`/super/skills/${id}`);
                fetchSkills();
            } catch (err) {
                setError('Failed to delete skill');
            }
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Skills</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Add Skill
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f9fafb' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedSkills.map((skill) => (
                            <TableRow key={skill.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {skill.iconUrl && <img src={skill.iconUrl} alt="" style={{ width: 20, height: 20 }} />}
                                        <Chip label={skill.name} size="small" sx={{ bgcolor: 'rgba(255, 87, 34, 0.1)', color: 'primary.main', fontWeight: 600 }} />
                                    </Box>
                                </TableCell>
                                <TableCell>{skill.category || '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={skill.isTechnical ? 'Technical' : 'Soft Skill'}
                                        size="small"
                                        color={skill.isTechnical ? 'info' : 'success'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleOpenDialog(skill)} color="primary">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(skill.id)} color="error">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {skills.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    No skills found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={skills.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Skill Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Category"
                            fullWidth
                            placeholder="e.g. Frontend, Backend, Database"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isTechnical}
                                    onChange={(e) => setFormData({ ...formData, isTechnical: e.target.checked })}
                                />
                            }
                            label="Is Technical Skill?"
                        />
                        <TextField
                            label="Icon URL"
                            fullWidth
                            value={formData.iconUrl}
                            onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!formData.name}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default SkillList;
