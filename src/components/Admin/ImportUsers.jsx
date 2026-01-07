import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Input,
    Button,
    CircularProgress,
    Alert,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';

const ImportUsers = ({ onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [previewData, setPreviewData] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setPreviewData(null); // Reset preview on new file
        setSuccessMsg('');
        setError('');
    };

    const handleParseCsv = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setError('');
        setSuccessMsg('');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await api.post('/admin/users/parse-csv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPreviewData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to parse CSV.');
        } finally {
            setUploading(false);
        }
    };

    const handleDataChange = (index, field, value) => {
        const newData = [...previewData];
        newData[index] = { ...newData[index], [field]: value };
        setPreviewData(newData);
    };

    const handleDeleteRow = (index) => {
        const newData = [...previewData];
        newData.splice(index, 1);
        setPreviewData(newData);
    };

    const handleSyncUsers = async () => {
        setSyncing(true);
        setError('');
        try {
            const response = await api.post('/admin/users/sync', { users: previewData });
            setSuccessMsg(`Successfully processed ${response.data.results.success} users. Failed: ${response.data.results.failed}`);
            if (response.data.results.failed > 0) {
                // Optionally show details of failures
                // setError(JSON.stringify(response.data.results.errors));
            }
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Sync failed.');
        } finally {
            setSyncing(false);
        }
    };

    const handleCancel = () => {
        setPreviewData(null);
        setSelectedFile(null);
        setError('');
        setSuccessMsg('');
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>Import Users</Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!previewData ? (
                // Upload Step
                <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Upload a CSV file to preview and edit user data before creating accounts.<br />
                        Format: rollNumber, name, dob, department, section, graduationYear (role defaults to STUDENT)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Input type="file" onChange={handleFileChange} />
                        <Button
                            variant="contained"
                            onClick={handleParseCsv}
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Preview Data'}
                        </Button>
                    </Box>
                </Box>
            ) : (
                // Preview & Edit Step
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="subtitle1">Preview Data ({previewData.length} records)</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">Set All Roles:</Typography>
                                <Select
                                    size="small"
                                    defaultValue=""
                                    displayEmpty
                                    onChange={(e) => {
                                        const newRole = e.target.value;
                                        if (newRole) {
                                            const newData = previewData.map(row => ({ ...row, role: newRole }));
                                            setPreviewData(newData);
                                        }
                                    }}
                                    sx={{ minWidth: 120 }}
                                >
                                    <MenuItem value="" disabled>Select Role</MenuItem>
                                    <MenuItem value="STUDENT">Student</MenuItem>
                                    <MenuItem value="ALUMNI">Alumni</MenuItem>
                                    <MenuItem value="FACULTY">Faculty</MenuItem>
                                </Select>
                            </Box>

                            <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSyncUsers}
                                disabled={syncing || previewData.length === 0}
                            >
                                {syncing ? <CircularProgress size={20} color="inherit" /> : 'Create/Update Users'}
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Roll No</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Dept</TableCell>
                                    <TableCell>Section</TableCell>
                                    <TableCell>Year</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewData.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>
                                            <TextField
                                                value={row.rollNumber || ''}
                                                onChange={(e) => handleDataChange(index, 'rollNumber', e.target.value)}
                                                variant="standard"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={row.name || ''}
                                                onChange={(e) => handleDataChange(index, 'name', e.target.value)}
                                                variant="standard"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={row.role || 'STUDENT'}
                                                onChange={(e) => handleDataChange(index, 'role', e.target.value)}
                                                variant="standard"
                                                size="small"
                                            >
                                                <MenuItem value="STUDENT">Student</MenuItem>
                                                <MenuItem value="ALUMNI">Alumni</MenuItem>
                                                <MenuItem value="FACULTY">Faculty</MenuItem>
                                                <MenuItem value="COLLEGE_ADMIN">Admin</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={row.department || ''}
                                                onChange={(e) => handleDataChange(index, 'department', e.target.value)}
                                                variant="standard"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={row.section || ''}
                                                onChange={(e) => handleDataChange(index, 'section', e.target.value)}
                                                variant="standard"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={row.graduationYear || ''}
                                                onChange={(e) => handleDataChange(index, 'graduationYear', e.target.value)}
                                                variant="standard"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="error" onClick={() => handleDeleteRow(index)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Paper>
    );
};

export default ImportUsers;
