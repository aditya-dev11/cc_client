import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Drawer,
  useTheme,
  useMediaQuery,
  Typography,
  Button
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/Search/FilterBar';
import FilterDrawerContent from '../components/Search/FilterDrawerContent';
import UserGrid from '../components/Search/UserGrid';

function SearchPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [companyInput, setCompanyInput] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);
  const [skillLoading, setSkillLoading] = useState(false);
  const [userType, setUserType] = useState('');
  // New Filters
  const [graduationYear, setGraduationYear] = useState([]);
  const [department, setDepartment] = useState([]);
  const [section, setSection] = useState('');
  const [deptOptions, setDeptOptions] = useState([]);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/analytics/departments');
        setDeptOptions(res.data);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepts();
  }, []);

  const navigate = useNavigate();

  const handleSearch = async (resetPage = false) => {
    if (loading) return;
    setLoading(true);
    setError('');

    const currentPage = resetPage ? 1 : page;

    try {
      const params = {
        page: currentPage,
        limit: 12,
        search,
        skill: selectedSkills.join(','),
        company: selectedCompanies.join(','),
        userType,
        graduationYear: graduationYear.join(','),
        department: department.join(','),
        section,
      };

      const response = await api.get('/users', { params });

      if (resetPage) {
        setUsers(response.data.users);
      } else {
        setUsers(prev => [...prev, ...response.data.users]);
      }

      setHasMore(currentPage < response.data.totalPages);
      if (resetPage) setPage(2);
      else setPage(prev => prev + 1);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleSmartSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/search/analyze', { query: search });
      const { filters, results } = res.data;
      const { skills, companies, userType: type, name, graduationYear: gradYear, department: dept, section: sect } = filters;

      // Update filters
      if (skills && skills.length > 0) setSelectedSkills(skills);
      if (companies && companies.length > 0) setSelectedCompanies(companies);
      if (type) setUserType(type);
      if (name) setSearch(name); else setSearch('');
      if (gradYear && gradYear.length > 0) setGraduationYear(gradYear);
      if (dept && dept.length > 0) setDepartment(dept);
      if (sect) setSection(sect);

      // Update users directly
      setUsers(results);
      setHasMore(false); // Backend returns all results
      setPage(1);

    } catch (err) {
      console.error("Smart search failed", err);
      setError("Failed to analyze search query.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(true);
  }, []);

  const handleApplyFilters = () => {
    setFilterDrawerOpen(false);
    handleSearch(true);
  };

  const handleClearFilters = async () => {
    setSearch('');
    setSelectedSkills([]);
    setSelectedCompanies([]);
    setSelectedCompanies([]);
    setUserType('');
    setGraduationYear([]);
    setDepartment([]);
    setSection('');

    // Trigger search with empty values immediately
    setLoading(true);
    setError('');
    try {
      const params = {
        page: 1,
        limit: 12,
        search: '',
        skill: '',
        company: '',
        userType: '',
        graduationYear: '',
        department: '',
        section: '',
      };

      const response = await api.get('/users', { params });
      setUsers(response.data.users);
      setHasMore(1 < response.data.totalPages);
      setPage(2);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Filter Handlers
  const addSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
      setSkillOptions([]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  };

  const addCompany = () => {
    if (companyInput.trim() && !selectedCompanies.includes(companyInput.trim())) {
      setSelectedCompanies([...selectedCompanies, companyInput.trim()]);
      setCompanyInput('');
      setCompanyOptions([]);
    }
  };

  const removeCompany = (companyToRemove) => {
    setSelectedCompanies(selectedCompanies.filter(c => c !== companyToRemove));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      <FilterBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        handleSmartSearch={handleSmartSearch}
        userType={userType}
        setUserType={setUserType}
        setFilterDrawerOpen={setFilterDrawerOpen}
        isMobile={isMobile}
        loading={loading}
      />

      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 1600, mx: 'auto' }}>
        {loading && users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {users.length > 0 ? (
              <UserGrid users={users} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h6" gutterBottom>No matches found</Typography>
                <Typography color="text.secondary">Try changing your filters or search terms</Typography>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Clear all filters
                </Button>
              </Box>
            )}

            {hasMore && users.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleSearch(false)}
                  disabled={loading}
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                  }}
                >
                  {loading ? 'Loading more...' : 'Show more'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px 0 0 16px' } }}
      >
        <FilterDrawerContent
          isMobile={isMobile}
          setFilterDrawerOpen={setFilterDrawerOpen}
          companyOptions={companyOptions}
          setCompanyOptions={setCompanyOptions}
          companyLoading={companyLoading}
          setCompanyLoading={setCompanyLoading}
          companyInput={companyInput}
          setCompanyInput={setCompanyInput}
          addCompany={addCompany}
          selectedCompanies={selectedCompanies}
          removeCompany={removeCompany}
          skillOptions={skillOptions}
          setSkillOptions={setSkillOptions}
          skillLoading={skillLoading}
          setSkillLoading={setSkillLoading}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          addSkill={addSkill}
          selectedSkills={selectedSkills}
          removeSkill={removeSkill}
          handleClearFilters={handleClearFilters}
          handleApplyFilters={handleApplyFilters}
          graduationYear={graduationYear}
          setGraduationYear={setGraduationYear}
          department={department}
          setDepartment={setDepartment}
          section={section}
          setSection={setSection}
          deptOptions={deptOptions}
        />
      </Drawer>
    </Box>
  );
}

export default SearchPage;
