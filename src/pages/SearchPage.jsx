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
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/Search/FilterBar';
import FilterDrawerContent from '../components/Search/FilterDrawerContent';
import UserGrid from '../components/Search/UserGrid';
import { getAllUsers } from '../services/firestoreService';

function SearchPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // New Manam Filter States
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setAllUsers(usersData);
        setDisplayedUsers(usersData);
      } catch (err) {
        setError('Failed to load users from database.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  // Client-side Filtering Logic
  const handleSearch = () => {
    let filtered = [...allUsers];

    // Filter by name/username
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(u =>
        (u.displayName && u.displayName.toLowerCase().includes(query)) ||
        (u.username && u.username.toLowerCase().includes(query)) ||
        (u.bio && u.bio.toLowerCase().includes(query))
      );
    }

    // Filter by Gender
    if (gender) {
      filtered = filtered.filter(u => u.gender === gender);
    }

    // Filter by Marital Status
    if (maritalStatus) {
      filtered = filtered.filter(u => u.maritalStatus === maritalStatus);
    }

    // Filter by Interests (User must have at least one overlapping interest)
    if (selectedInterests.length > 0) {
      filtered = filtered.filter(u =>
        u.interests && u.interests.some(i => selectedInterests.includes(i))
      );
    }

    // Filter by Skills (User must have at least one overlapping skill)
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(u =>
        u.skills && u.skills.some(s => selectedSkills.includes(s))
      );
    }

    setDisplayedUsers(filtered);
  };

  // Run filter whenever search text or fast-filters change
  useEffect(() => {
    handleSearch();
  }, [search, allUsers]);

  const handleApplyFilters = () => {
    setFilterDrawerOpen(false);
    handleSearch();
  };

  const handleClearFilters = () => {
    setSearch('');
    setGender('');
    setMaritalStatus('');
    setSelectedInterests([]);
    setSelectedSkills([]);
    setDisplayedUsers(allUsers);
  };

  // Filter Handlers
  const addSkill = () => {
    let val = skillInput.trim();
    if (val && !selectedSkills.includes(val)) {
      setSelectedSkills([...selectedSkills, val]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  };

  const addInterest = () => {
    let val = interestInput.trim();
    if (val && !selectedInterests.includes(val)) {
      setSelectedInterests([...selectedInterests, val]);
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interestToRemove));
  };


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      <FilterBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        setFilterDrawerOpen={setFilterDrawerOpen}
        isMobile={isMobile}
        loading={loading}
      />

      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 1600, mx: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {displayedUsers.length > 0 ? (
              <UserGrid users={displayedUsers} />
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
          gender={gender}
          setGender={setGender}
          maritalStatus={maritalStatus}
          setMaritalStatus={setMaritalStatus}
          interestInput={interestInput}
          setInterestInput={setInterestInput}
          addInterest={addInterest}
          selectedInterests={selectedInterests}
          removeInterest={removeInterest}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          addSkill={addSkill}
          selectedSkills={selectedSkills}
          removeSkill={removeSkill}
          handleClearFilters={handleClearFilters}
          handleApplyFilters={handleApplyFilters}
        />
      </Drawer>
    </Box>
  );
}

export default SearchPage;
