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
    TablePagination,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Divider,
    FormControl,
    InputLabel,
    Select,
    Tooltip,
    alpha
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../services/api';

// Airbnb-like color palette for statuses
const getStatusStyle = (status) => {
    switch (status) {
        case 'OPEN':
            return { bg: '#FFEBE5', color: '#D93025', border: '#FAC7BD' }; // Soft Red
        case 'VALIDATED':
            return { bg: '#E3F2FD', color: '#1976D2', border: '#BBDEFB' }; // Soft Blue
        case 'IN_PROGRESS':
            return { bg: '#FFF3E0', color: '#E65100', border: '#FFE0B2' }; // Soft Orange
        case 'ON_HOLD':
            return { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' }; // Grey
        case 'RESOLVED':
        case 'COMPLETED':
            return { bg: '#E8F5E9', color: '#2E7D32', border: '#C8E6C9' }; // Soft Green
        case 'REJECTED':
            return { bg: '#FFEBEE', color: '#C62828', border: '#FFCDD2' }; // Redder
        case 'CLOSED':
            return { bg: '#ECEFF1', color: '#455A64', border: '#CFD8DC' }; // Blue Grey
        default:
            return { bg: '#F5F5F5', color: '#000000', border: '#E0E0E0' };
    }
};

const getPriorityStyle = (priority) => {
    switch (priority) {
        case 'CRITICAL':
            return { bg: '#FCE4EC', color: '#C2185B' }; // Pink
        case 'HIGH':
            return { bg: '#FFF8E1', color: '#FBC02D' }; // Yellow
        case 'MEDIUM':
            return { bg: '#E0F2F1', color: '#00796B' }; // Teal
        case 'LOW':
            return { bg: '#F3E5F5', color: '#7B1FA2' }; // Purple
        default:
            return { bg: '#F5F5F5', color: '#000' };
    }
};

const TicketList = ({ role }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [statusUpdate, setStatusUpdate] = useState('');

    // Pagination & Filter States
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPriority, setFilterPriority] = useState('ALL');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/support');
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleViewTicket = async (ticket) => {
        setSelectedTicket(ticket);
        setStatusUpdate(ticket.status);
        try {
            const res = await api.get(`/support/${ticket.id}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        setSelectedTicket(null);
        setComments([]);
        setComment('');
    };

    const handleStatusUpdate = async () => {
        try {
            await api.put(`/support/${selectedTicket.id}/status`, { status: statusUpdate });
            const updatedTickets = tickets.map(t =>
                t.id === selectedTicket.id ? { ...t, status: statusUpdate } : t
            );
            setTickets(updatedTickets);
            setSelectedTicket(prev => ({ ...prev, status: statusUpdate }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        try {
            const res = await api.post(`/support/${selectedTicket.id}/comments`, { content: comment });
            setComments([...comments, res.data]);
            setComment('');
        } catch (err) {
            console.error(err);
        }
    };

    // Pagination Handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter Logic
    const filteredTickets = tickets.filter(ticket => {
        if (filterStatus !== 'ALL' && ticket.status !== filterStatus) return false;
        if (filterPriority !== 'ALL' && ticket.priority !== filterPriority) return false;
        return true;
    });

    const paginatedTickets = filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const StatusChip = ({ status }) => {
        const style = getStatusStyle(status);
        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    bgcolor: style.bg,
                    color: style.color,
                    border: `1px solid ${style.border}`,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: '24px',
                    '& .MuiChip-label': { px: 1 }
                }}
            />
        );
    };

    return (
        <Box sx={{ p: 1 }}>
            {/* Header & Filters */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#222' }}>
                    Support Tickets
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            label="Status"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="ALL">All Status</MenuItem>
                            <MenuItem value="OPEN">Open</MenuItem>
                            <MenuItem value="VALIDATED">Validated</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                            <MenuItem value="CLOSED">Closed</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={filterPriority}
                            label="Priority"
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <MenuItem value="ALL">All Priority</MenuItem>
                            <MenuItem value="CRITICAL">Critical</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="LOW">Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    mb: 2,
                    border: '1px solid #E0E0E0',
                    borderRadius: 3,
                    overflow: 'hidden'
                }}
            >
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <TableHead sx={{ bgcolor: '#F7F7F7' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#484848' }}>Ticket ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#484848' }}>Subject</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#484848' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#484848' }}>Reported By</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#484848' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#484848' }}>Priority</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#484848' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#484848' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedTickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No tickets found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedTickets.map((row) => {
                                    const priorityStyle = getPriorityStyle(row.priority);
                                    return (
                                        <TableRow
                                            hover
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                            onClick={() => handleViewTicket(row)}
                                        >
                                            <TableCell component="th" scope="row" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                                #{row.id.slice(0, 8)}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{row.title}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {row.User?.Profile?.fullName || row.User?.username}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {row.User?.role}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        padding: '4px 8px',
                                                        borderRadius: '8px',
                                                        fontWeight: 700,
                                                        bgcolor: priorityStyle.bg,
                                                        color: priorityStyle.color
                                                    }}
                                                >
                                                    {row.priority}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <StatusChip status={row.status} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewTicket(row);
                                                        }}
                                                        sx={{ color: '#FF385C' }} // Airbnb accent color
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredTickets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Detail Modal */}
            <Dialog
                open={!!selectedTicket}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                {selectedTicket && (
                    <>
                        <DialogTitle sx={{ pb: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6" fontWeight="700">{selectedTicket.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Reported by {selectedTicket.User?.Profile?.fullName || selectedTicket.User?.username} on {new Date(selectedTicket.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                                <StatusChip status={selectedTicket.status} />
                            </Box>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Box mb={4}>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 600 }}>DESCRIPTION</Typography>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#FAFAFA', borderRadius: 2, border: '1px solid #EEEEEE' }}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</Typography>
                                </Paper>
                            </Box>

                            <Box mb={4}>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 600 }}>UPDATE STATUS</Typography>
                                <Box display="flex" gap={2} alignItems="center">
                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                        <Select
                                            value={statusUpdate}
                                            onChange={(e) => setStatusUpdate(e.target.value)}
                                            disabled={role === 'STUDENT' || role === 'ALUMNI'}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="OPEN">OPEN</MenuItem>
                                            <MenuItem value="VALIDATED">VALIDATED</MenuItem>
                                            <MenuItem value="REJECTED">REJECTED</MenuItem>
                                            <MenuItem value="RESOLVED">RESOLVED</MenuItem>
                                            {(role === 'SUPER_ADMIN' || role === 'ADMIN') && <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>}
                                            {(role === 'SUPER_ADMIN' || role === 'ADMIN') && <MenuItem value="ON_HOLD">ON HOLD</MenuItem>}
                                            {(role === 'SUPER_ADMIN' || role === 'ADMIN') && <MenuItem value="CLOSED">CLOSED</MenuItem>}
                                        </Select>
                                    </FormControl>
                                    {(role === 'SUPER_ADMIN' || role === 'ADMIN') ? (
                                        <Button
                                            variant="contained"
                                            onClick={handleStatusUpdate}
                                            sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#FF385C', '&:hover': { bgcolor: '#E01741' } }}
                                        >
                                            Update
                                        </Button>
                                    ) : null}
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="h6" gutterBottom fontWeight="700">Discussion</Typography>
                                <Paper variant="outlined" sx={{ maxHeight: 300, overflowY: 'auto', p: 0, mb: 2, borderRadius: 2, border: '1px solid #EEEEEE' }}>
                                    <Table>
                                        <TableBody>
                                            {comments.length === 0 && (
                                                <TableRow>
                                                    <TableCell align="center" sx={{ borderBottom: 'none', py: 3, color: 'text.secondary' }}>No comments yet.</TableCell>
                                                </TableRow>
                                            )}
                                            {comments.map((c) => (
                                                <TableRow key={c.id}>
                                                    <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                                                        <Box>
                                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                                <Typography variant="subtitle2" fontWeight="700">
                                                                    {c.User?.Profile?.fullName || c.User?.username}
                                                                    <Typography component="span" variant="caption" sx={{ ml: 1, bgcolor: '#F5F5F5', px: 1, py: 0.2, borderRadius: 1 }}>{c.User.role}</Typography>
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {new Date(c.createdAt).toLocaleString()}
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body2" color="#484848">{c.content}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                                <Box display="flex" gap={1}>
                                    <TextField
                                        fullWidth
                                        placeholder="Type your reply..."
                                        size="small"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddComment}
                                        sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#222', '&:hover': { bgcolor: '#000' } }}
                                    >
                                        Post
                                    </Button>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={handleClose} sx={{ color: '#484848', fontWeight: 600 }}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default TicketList;
