import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';
import DataTable from '../common/DataTable';
import PageHeader from '../common/PageHeader';
import StatusChip from '../common/StatusChip';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        location: '',
        description: '',
        industry: '',
        size: '',
        foundedYear: '',
        linkedinUrl: '',
        logoUrl: '',
        isVerified: false
    });

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super/companies');
            setCompanies(res.data);
        } catch (err) {
            setError('Failed to fetch companies');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleOpenDialog = (company = null) => {
        if (company) {
            setEditingCompany(company);
            setFormData({
                name: company.name,
                website: company.website || '',
                location: company.location || '',
                description: company.description || '',
                industry: company.industry || '',
                size: company.size || '',
                foundedYear: company.foundedYear || '',
                linkedinUrl: company.linkedinUrl || '',
                logoUrl: company.logoUrl || '',
                isVerified: company.isVerified || false
            });
        } else {
            setEditingCompany(null);
            setFormData({
                name: '',
                website: '',
                location: '',
                description: '',
                industry: '',
                size: '',
                foundedYear: '',
                linkedinUrl: '',
                logoUrl: '',
                isVerified: false
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCompany(null);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            if (editingCompany) {
                await api.put(`/super/companies/${editingCompany.id}`, formData);
            } else {
                await api.post('/super/companies', formData);
            }
            fetchCompanies();
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to save company');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await api.delete(`/super/companies/${id}`);
                fetchCompanies();
            } catch (err) {
                setError('Failed to delete company');
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (company.location && company.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const paginatedCompanies = filteredCompanies.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <PageHeader
                title="Companies"
                actionLabel="Add Company"
                onAction={() => handleOpenDialog()}
                actionIcon={<AddIcon />}
            />

            <DataTable
                columns={[
                    {
                        id: 'name',
                        label: 'Name',
                        render: (row) => (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {row.logoUrl && <img src={row.logoUrl} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />}
                                <Typography variant="body2" fontWeight={500} fontSize="inherit">{row.name}</Typography>
                                {row.isVerified && <StatusChip label="Verified" type="verified" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                            </Box>
                        )
                    },
                    { id: 'industry', label: 'Industry', format: (val) => val || '-' },
                    { id: 'size', label: 'Size', format: (val) => val || '-' },
                    { id: 'location', label: 'Location', format: (val) => val || '-' },
                    {
                        id: 'actions',
                        label: 'Actions',
                        align: 'right',
                        render: (row) => (
                            <Box>
                                <IconButton size="small" onClick={() => handleOpenDialog(row)} color="primary" sx={{ p: 0.5 }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(row.id)} color="error" sx={{ p: 0.5 }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )
                    }
                ]}
                data={paginatedCompanies}
                loading={loading}
                error={error}
                searchPlaceholder="Search companies..."
                searchValue={searchQuery}
                onSearchChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                }}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredCompanies.length}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{editingCompany ? 'Edit Company' : 'Add Company'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                        <TextField
                            label="Company Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Industry"
                            fullWidth
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        />
                        <TextField
                            label="Size (e.g. 10-50)"
                            fullWidth
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        />
                        <TextField
                            label="Founded Year"
                            fullWidth
                            type="number"
                            value={formData.foundedYear}
                            onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                        />
                        <TextField
                            label="Website"
                            fullWidth
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                        <TextField
                            label="LinkedIn URL"
                            fullWidth
                            value={formData.linkedinUrl}
                            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        />
                        <TextField
                            label="Location"
                            fullWidth
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        <TextField
                            label="Logo URL"
                            fullWidth
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ gridColumn: 'span 2' }}
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
        </Box>
    );
};

export default CompanyList;
