import React from 'react';
import { Box, Button } from '@mui/material';
import DataTable from '../common/DataTable';
import PageHeader from '../common/PageHeader';

const CollegeList = ({ colleges, loading, error, setActiveSection, handleOpenAddAdmin }) => {
    const columns = [
        {
            id: 'name',
            label: 'College Name',
            render: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {row.logoUrl && (
                        <Box
                            component="img"
                            src={row.logoUrl}
                            alt={row.name}
                            sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                        />
                    )}
                    {row.name}
                </Box>
            )
        },
        { id: 'subdomain', label: 'Subdomain' },
        { id: 'adminCount', label: 'No. of Admins', format: (value) => value || 0 },
        { id: 'createdAt', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            render: (row) => (
                <Button size="small" variant="contained" color="secondary" onClick={() => handleOpenAddAdmin(row)}>Add Admin</Button>
            )
        }
    ];

    return (
        <Box>
            <PageHeader
                title="Registered Colleges"
                actionLabel="Add New College"
                onAction={() => setActiveSection('create-college')}
            />

            <DataTable
                columns={columns}
                data={colleges}
                loading={loading}
                error={error}
            />
        </Box>
    );
};

export default CollegeList;
