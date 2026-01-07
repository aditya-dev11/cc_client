import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    TextField,
    TablePagination,
    Checkbox
} from '@mui/material';

/**
 * Reusable DataTable component
 * 
 * @param {Array} columns - Array of column objects: { id, label, align, minWidth, format, render }
 * @param {Array} data - Array of data objects
 * @param {Boolean} loading - Loading state
 * @param {String} error - Error message
 * @param {String} searchPlaceholder - Placeholder for search input
 * @param {String} searchValue - Current search value
 * @param {Function} onSearchChange - Handler for search input change
 * @param {Number} page - Current page index
 * @param {Number} rowsPerPage - Rows per page
 * @param {Number} totalCount - Total number of items
 * @param {Function} onPageChange - Handler for page change
 * @param {Function} onRowsPerPageChange - Handler for rows per page change
 * @param {Boolean} selectable - Enable row selection
 * @param {Array} selectedIds - Array of selected row IDs
 * @param {Function} onSelectionChange - Handler for selection change (returns new array of IDs)
 * @param {React.ReactNode} actions - Optional actions to render next to search
 */
const DataTable = ({
    columns,
    data,
    loading,
    error,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    page,
    rowsPerPage,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    actions
}) => {

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = data.map((n) => n.id);
            onSelectionChange(newSelecteds);
            return;
        }
        onSelectionChange([]);
    };

    const handleSelectClick = (event, id) => {
        const selectedIndex = selectedIds.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIds.slice(0, selectedIndex),
                selectedIds.slice(selectedIndex + 1),
            );
        }
        onSelectionChange(newSelected);
    };

    const isSelected = (id) => selectedIds.indexOf(id) !== -1;

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                {onSearchChange && (
                    <TextField
                        label={searchPlaceholder || "Search"}
                        variant="outlined"
                        size="small"
                        value={searchValue}
                        onChange={onSearchChange}
                        sx={{ width: 300 }}
                    />
                )}
                {actions && <Box>{actions}</Box>}
            </Box>

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && !error && (
                <>
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                                checked={data.length > 0 && selectedIds.length === data.length}
                                                onChange={handleSelectAllClick}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => {
                                    const isItemSelected = selectable ? isSelected(row.id) : false;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            {selectable && (
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        onChange={(event) => handleSelectClick(event, row.id)}
                                                    />
                                                </TableCell>
                                            )}
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.render ? column.render(row) : (column.format ? column.format(value) : value)}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center" sx={{ py: 3 }}>
                                            <Typography color="textSecondary">No data found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {onPageChange && (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onPageChange}
                            onRowsPerPageChange={onRowsPerPageChange}
                        />
                    )}
                </>
            )}
        </Box>
    );
};

export default DataTable;
