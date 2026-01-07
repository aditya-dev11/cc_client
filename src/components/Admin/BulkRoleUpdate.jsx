import React, { useState } from 'react';
import {
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Alert
} from '@mui/material';
import api from '../../services/api';

const BulkRoleUpdate = ({ selectedUsers, onSuccess, clearSelection }) => {
    const [newRole, setNewRole] = useState('');
    const [error, setError] = useState('');

    const handleBulkUpdateRole = async () => {
        if (selectedUsers.length === 0 || !newRole) return;
        setError('');
        try {
            await api.put('/admin/users/bulk-update-role', {
                userIds: selectedUsers,
                newRole: newRole,
            });
            if (onSuccess) onSuccess();
            if (clearSelection) clearSelection();
            setNewRole('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update roles.');
        }
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Bulk Role Update</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={newRole}
                        label="Role"
                        onChange={(e) => setNewRole(e.target.value)}
                    >
                        <MenuItem value="STUDENT">Student</MenuItem>
                        <MenuItem value="ALUMNI">Alumni</MenuItem>
                        <MenuItem value="FACULTY">Faculty</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleBulkUpdateRole}
                    disabled={selectedUsers.length === 0 || !newRole}
                >
                    Update {selectedUsers.length > 0 ? `${selectedUsers.length} Users` : 'Selected'}
                </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
    );
};

import { Box } from '@mui/material'; // Import Box since I used it

export default BulkRoleUpdate;
