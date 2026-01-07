import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import api from '../../services/api';
import BulkRoleUpdate from './BulkRoleUpdate';
import DataTable from '../common/DataTable';
import PageHeader from '../common/PageHeader';
import StatusChip from '../common/StatusChip';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users', {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    search: search,
                },
            });
            setUsers(response.data.users);
            setTotalUsers(response.data.total);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch users.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const columns = [
        {
            id: 'fullName',
            label: 'Name',
            render: (row) => row.Profile?.fullName || 'N/A'
        },
        { id: 'username', label: 'Username' },
        {
            id: 'email',
            label: 'Email',
            format: (value) => value || 'N/A'
        },
        {
            id: 'role',
            label: 'Role',
            render: (row) => <StatusChip label={row.role} type="role" size="small" />
        },
    ];

    return (
        <Box>
            <BulkRoleUpdate
                selectedUsers={selectedUsers}
                onSuccess={fetchUsers}
                clearSelection={() => setSelectedUsers([])}
            />

            <PageHeader title="Manage Users" />

            <DataTable
                columns={columns}
                data={users}
                loading={loading}
                error={error}
                searchPlaceholder="Search Users"
                searchValue={search}
                onSearchChange={handleSearchChange}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalUsers}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                selectable={true}
                selectedIds={selectedUsers}
                onSelectionChange={setSelectedUsers}
            />
        </Box>
    );
};

export default UserList;
