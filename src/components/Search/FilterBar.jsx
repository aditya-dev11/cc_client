import React from 'react';
import {
    Box,
    Paper,
    InputAdornment,
    TextField,
    IconButton,
    Stack,
    Chip,
    Button,
    Tooltip,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const FilterBar = ({
    search,
    setSearch,
    handleSearch,
    handleSmartSearch,
    userType,
    setUserType,
    setFilterDrawerOpen,
    isMobile,
    loading
}) => {
    return (
        <Box sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            bgcolor: 'white',
            borderBottom: '1px solid #e9edef',
            py: 2,
            px: { xs: 2, md: 6 }
        }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ maxWidth: 1600, mx: 'auto' }}>
                {/* Search Input */}
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 40,
                        border: '1px solid #e0e0e0',
                        pl: 2,
                        pr: 1,
                        py: 0.5,
                        width: { xs: '100%', md: 550 }, // Increased width for better UX
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 6px 16px rgba(0,0,0,0.12)',
                            borderColor: 'primary.main'
                        },
                        '&:focus-within': {
                            boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 6px 16px rgba(0,0,0,0.12)',
                            borderColor: 'primary.main',
                            transform: 'scale(1.01)'
                        }
                    }}
                >
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#54656f' }} />
                    </InputAdornment>
                    <TextField
                        fullWidth
                        placeholder="Try 'Alumni at Google' or 'React developers'..."
                        variant="standard"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                // If query is long (>3 words), try smart search, otherwise normal
                                if (search.trim().split(' ').length > 3) {
                                    handleSmartSearch();
                                } else {
                                    handleSearch(true);
                                }
                            }
                        }}
                        InputProps={{ disableUnderline: true }}
                        sx={{ ml: 1 }}
                    />

                    <Tooltip title="AI Smart Search">
                        <IconButton
                            sx={{
                                color: 'primary.main',
                                p: 1,
                                mr: 0.5,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.1)', transform: 'scale(1.1)' }
                            }}
                            onClick={handleSmartSearch}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} color="primary" /> : <AutoAwesomeIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>


                    <IconButton
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            p: 1,
                            ml: 0.5,
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.05)' }
                        }}
                        onClick={() => handleSearch(true)}
                        disabled={loading}
                    >
                        <SearchIcon fontSize="small" />
                    </IconButton>
                </Paper>

                {/* Quick Filters (Desktop) */}
                {!isMobile && (
                    <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
                        {['', 'student', 'alumni'].map((type) => (
                            <Chip
                                key={type}
                                label={type === '' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                                onClick={() => { setUserType(type); handleSearch(true); }}
                                sx={{
                                    bgcolor: userType === type ? 'rgba(255, 87, 34, 0.1)' : 'white',
                                    color: userType === type ? 'primary.main' : '#111b21',
                                    border: userType === type ? '1px solid' : '1px solid #e0e0e0',
                                    borderColor: userType === type ? 'primary.main' : '#e0e0e0',
                                    fontWeight: userType === type ? 600 : 400,
                                    '&:hover': { bgcolor: userType === type ? 'rgba(255, 87, 34, 0.2)' : '#f7f7f7' }
                                }}
                            />
                        ))}
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => setFilterDrawerOpen(true)}
                            sx={{
                                borderRadius: 20,
                                borderColor: '#e0e0e0',
                                color: '#111b21',
                                textTransform: 'none',
                                '&:hover': { borderColor: '#111b21', bgcolor: 'transparent' }
                            }}
                        >
                            Filters
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
};

export default FilterBar;
