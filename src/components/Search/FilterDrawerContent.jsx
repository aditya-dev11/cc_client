import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Autocomplete,
    TextField,
    Button,
    Chip,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../services/api';

const FilterDrawerContent = ({
    isMobile,
    setFilterDrawerOpen,
    gender,
    setGender,
    maritalStatus,
    setMaritalStatus,
    interestInput,
    setInterestInput,
    addInterest,
    selectedInterests,
    removeInterest,
    skillInput,
    setSkillInput,
    addSkill,
    selectedSkills,
    removeSkill,
    handleClearFilters,
    handleApplyFilters
}) => {
    return (
        <Box sx={{ p: 3, width: isMobile ? 'auto' : 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Filters</Typography>
                <IconButton onClick={() => setFilterDrawerOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>

                {/* Personal Details Filters */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>Personal Details</Typography>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            SelectProps={{ native: true }}
                        >
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </TextField>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Marital Status"
                            value={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.value)}
                            SelectProps={{ native: true }}
                        >
                            <option value=""></option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </TextField>
                    </Box>

                    <Divider sx={{ my: 3 }} />
                </Box>

                {/* Interests Filter */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>Interests</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Filter by hobbies or interests</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="e.g. Photography"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={addInterest}
                            color="primary"
                        >
                            Add
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedInterests.map(interest => (
                            <Chip
                                key={interest}
                                label={interest}
                                onDelete={() => removeInterest(interest)}
                                sx={{ bgcolor: '#f7f7f7', border: '1px solid #e0e0e0' }}
                            />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Skills Filter */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>Skills</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Filter by technical skills</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="e.g. React"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={addSkill}
                            color="primary"
                        >
                            Add
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedSkills.map(skill => (
                            <Chip
                                key={skill}
                                label={skill}
                                onDelete={() => removeSkill(skill)}
                                sx={{ bgcolor: '#f7f7f7', border: '1px solid #e0e0e0' }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ pt: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button onClick={handleClearFilters} sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                    Clear all
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    color="primary"
                    sx={{
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                    }}
                >
                    Show results
                </Button>
            </Box>
        </Box>
    );
};

export default FilterDrawerContent;
