import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Chip,
  Grid,
  Stack,
  Card,
  CardContent,
  Divider,
  Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import api from '../../services/api';

function CareerForm({ onClose, onSave }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState('');
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);
  const [skillLoading, setSkillLoading] = useState(false);

  // Location State
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [locality, setLocality] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/me');
        const fetchedExperiences = (response.data.Experiences || []).map((exp) => ({
          ...exp,
          companyName: exp.Company?.name,
        }));

        setExperiences(fetchedExperiences);
        setSkills(response.data.Skills || []);

        // Load existing location
        setCity(response.data.Profile?.city || '');
        setCountry(response.data.Profile?.country || '');
        setLocality(response.data.Profile?.locality || '');

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch career data.');
        setLoading(false);
      }
    };
    fetchCareerData();
  }, []);

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, { companyName: '', title: '', startDate: '', endDate: '', description: '' }]);
  };

  const handleRemoveExperience = (index) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.some(skill => skill.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      setSkills([...skills, { name: newSkill.trim() }]);
      setNewSkill('');
      setSkillOptions([]);
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleResumeFileChange = (event) => {
    setSelectedResumeFile(event.target.files[0]);
  };

  const handleResumeUpload = async () => {
    if (!selectedResumeFile) {
      setResumeUploadError('Please select a resume file.');
      return;
    }

    setUploadingResume(true);
    setResumeUploadError('');
    setResumeUploadSuccess('');

    const formData = new FormData();
    formData.append('resume', selectedResumeFile);

    try {
      const response = await api.post('/users/me/parse-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const parsedData = response.data;

      if (parsedData.experiences && Array.isArray(parsedData.experiences)) {
        // Sort parsed experiences by start date descending
        const sortedExperiences = parsedData.experiences.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
          return dateB - dateA;
        });
        setExperiences(sortedExperiences);
      }
      if (parsedData.skills && Array.isArray(parsedData.skills)) {
        setSkills(parsedData.skills.map(s => ({ name: s.name || s })));
      }

      // Auto-fill Location from Resume
      if (parsedData.city) setCity(parsedData.city);
      if (parsedData.country) setCountry(parsedData.country);

      setResumeUploadSuccess('Resume parsed successfully! Please review the pre-filled data below.');
    } catch (err) {
      setResumeUploadError(err.response?.data?.msg || 'Resume upload and parsing failed.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Using OpenStreetMap Nominatim for free reverse geocoding
        // NOTE: In production, consider a paid API or your own backend proxy to handle keys/rate limits.
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();

        if (data.address) {
          setCity(data.address.city || data.address.town || data.address.village || '');
          setCountry(data.address.country || '');
        }
      } catch (error) {
        console.error("Error detecting location:", error);
      } finally {
        setDetectingLocation(false);
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      setDetectingLocation(false);
    });
  };

  const handleSave = async () => {
    try {
      setSaveError('');
      const experiencesToSave = experiences.map(exp => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
        endDate: exp.endDate === 'Present' ? null : (exp.endDate ? new Date(exp.endDate).toISOString() : null),
        companyName: exp.companyName || ''
      }));

      const skillsToSave = skills.map(s => s.name);

      await api.put('/users/me/career', {
        experiences: experiencesToSave,
        skills: skillsToSave,
        city,
        country,
        locality
      });
      onSave();
    } catch (err) {
      setSaveError(err.response?.data?.msg || 'Failed to save career data.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* Resume Upload Section - Highlighted */}
      <Card
        variant="outlined"
        sx={{
          mb: 5,
          border: '2px dashed #1976d2',
          bgcolor: '#f0f7ff',
          textAlign: 'center',
          p: 3
        }}
      >
        <CardContent>
          <AutoFixHighIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
            Autofill with Resume
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Upload your resume (PDF) and we'll extract your experience and skills automatically.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ px: 4, py: 1 }}
            >
              Select Resume
              <input type="file" hidden accept=".pdf" onChange={handleResumeFileChange} />
            </Button>
            {selectedResumeFile && (
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Selected: {selectedResumeFile.name}
              </Typography>
            )}

            <Button
              onClick={handleResumeUpload}
              disabled={!selectedResumeFile || uploadingResume}
              variant="outlined"
              size="small"
            >
              {uploadingResume ? <CircularProgress size={20} /> : 'Parse & Fill Data'}
            </Button>
          </Box>

          {resumeUploadSuccess && <Alert severity="success" sx={{ mt: 2, display: 'inline-flex' }}>{resumeUploadSuccess}</Alert>}
          {resumeUploadError && <Alert severity="error" sx={{ mt: 2, display: 'inline-flex' }}>{resumeUploadError}</Alert>}
        </CardContent>
      </Card>

      {/* Location Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Current Location</Typography>
          <Button
            startIcon={detectingLocation ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
            onClick={handleDetectLocation}
            disabled={detectingLocation}
            size="small"
            variant="outlined"
          >
            {detectingLocation ? 'Detecting...' : 'Get Location'}
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Locality / Area"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g. Madhapur, Hi-Tech City"
              helperText="Enter your specific residential area"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g. San Francisco"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g. USA"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Experiences Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Work Experience</Typography>
          <Button startIcon={<AddIcon />} onClick={handleAddExperience} size="small">
            Add New
          </Button>
        </Box>

        <Stack spacing={3}>
          {experiences.map((exp, index) => (
            <Card key={index} variant="outlined" sx={{ borderRadius: 3, borderColor: '#e0e0e0', overflow: 'visible' }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                borderBottom: '1px solid #f0f0f0',
                bgcolor: '#fafafa',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
              }}>
                <Typography variant="subtitle2" fontWeight="700" color="text.secondary">
                  Experience {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveExperience(index)}
                  sx={{
                    color: 'error.main',
                    bgcolor: 'rgba(211, 47, 47, 0.04)',
                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <Autocomplete
                      freeSolo
                      options={companyOptions}
                      getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                      loading={companyLoading}
                      value={exp.companyName || ''}
                      onInputChange={async (event, newInputValue) => {
                        handleExperienceChange(index, 'companyName', newInputValue);
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
                          label="Company Name"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </Box>

                  <TextField
                    label="Job Title"
                    value={exp.title || ''}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={exp.startDate ? exp.startDate.split('T')[0] : ''}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={exp.endDate ? exp.endDate.split('T')[0] : ''}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    fullWidth
                    helperText="Leave blank if currently working"
                  />

                  <TextField
                    label="Description"
                    value={exp.description || ''}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
          {experiences.length === 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
              No experience added yet. Upload a resume or add manually.
            </Typography>
          )}
        </Stack>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Skills Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Skills</Typography>
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#fafafa', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {skills.map((skill, index) => (
              <Chip
                key={skill.id || index}
                label={skill.name}
                onDelete={() => handleRemoveSkill(index)}
                color="primary"
                variant="filled"
              />
            ))}
            {skills.length === 0 && (
              <Typography variant="body2" color="textSecondary">No skills added.</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Autocomplete
              freeSolo
              fullWidth
              options={skillOptions}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              loading={skillLoading}
              value={newSkill}
              onInputChange={async (event, newInputValue) => {
                setNewSkill(newInputValue);
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
                  label="Add a skill"
                  size="small"
                  placeholder="e.g. React, Python"
                  onKeyPress={(e) => { if (e.key === 'Enter') { handleAddSkill(); e.preventDefault(); } }}
                />
              )}
            />
            <Button startIcon={<AddIcon />} onClick={handleAddSkill} variant="contained" sx={{ minWidth: 100 }}>
              Add
            </Button>
          </Box>
        </Paper>
      </Box>

      {saveError && (
        <Alert
          severity="error"
          sx={{ mt: 2, mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleSave}>
              RETRY
            </Button>
          }
        >
          {saveError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button variant="contained" onClick={handleSave} size="large" sx={{ px: 4 }}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}

export default CareerForm;