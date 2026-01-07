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
    companyOptions,
    setCompanyOptions,
    companyLoading,
    setCompanyLoading,
    companyInput,
    setCompanyInput,
    addCompany,
    selectedCompanies,
    removeCompany,
    skillOptions,
    setSkillOptions,
    skillLoading,
    setSkillLoading,
    skillInput,
    setSkillInput,
    addSkill,
    selectedSkills,
    removeSkill,
    handleClearFilters,
    handleApplyFilters,
    graduationYear,
    setGraduationYear,
    department,
    setDepartment,
    section,
    setSection,
    deptOptions
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

                {/* Year, Dept, Section Filters */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>Academic</Typography>

                    <Box sx={{ mb: 2 }}>
                        <Autocomplete
                            multiple
                            options={Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() - i))}
                            value={graduationYear}
                            onChange={(event, newValue) => {
                                setGraduationYear(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Graduation Year"
                                    placeholder="Select Year"
                                    size="small"
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Autocomplete
                            multiple
                            options={deptOptions}
                            value={department}
                            onChange={(event, newValue) => {
                                setDepartment(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Department"
                                    placeholder="Select Department"
                                    size="small"
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Section"
                            placeholder="e.g. A"
                            size="small"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />
                </Box>

                {/* Company Filter */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>Company</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Filter by companies they've worked at</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            options={companyOptions}
                            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                            loading={companyLoading}
                            value={companyInput}
                            onInputChange={async (event, newInputValue) => {
                                setCompanyInput(newInputValue);
                                if (newInputValue.length > 1) {
                                    setCompanyLoading(true);
                                    try {
                                        const res = await api.get(`/companies/search?query=${newInputValue}`);
                                        setCompanyOptions(res.data);
                                    } catch (err) {
                                        console.error("Failed to fetch companies", err);
                                    } finally {
                                        setCompanyLoading(false);
                                    }
                                } else {
                                    setCompanyOptions([]);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    placeholder="e.g. Google"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && addCompany()}
                                />
                            )}
                        />
                        <Button
                            variant="contained"
                            onClick={addCompany}
                            color="primary"
                        >
                            Add
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedCompanies.map(company => (
                            <Chip
                                key={company}
                                label={company}
                                onDelete={() => removeCompany(company)}
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
                        <Autocomplete
                            freeSolo
                            fullWidth
                            options={skillOptions}
                            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                            loading={skillLoading}
                            value={skillInput}
                            onInputChange={async (event, newInputValue) => {
                                setSkillInput(newInputValue);
                                if (newInputValue.length > 1) {
                                    setSkillLoading(true);
                                    try {
                                        const res = await api.get(`/skills/search?query=${newInputValue}`);
                                        setSkillOptions(res.data);
                                    } catch (err) {
                                        console.error("Failed to fetch skills", err);
                                    } finally {
                                        setSkillLoading(false);
                                    }
                                } else {
                                    setSkillOptions([]);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    placeholder="e.g. React"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                />
                            )}
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
