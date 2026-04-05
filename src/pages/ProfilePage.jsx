import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  TextField,
  MenuItem,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Fade,
  LinearProgress,
  Autocomplete,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  ArrowForward as ArrowIcon,
  School as EducationIcon,
  WorkOutline as WorkIcon,
  Psychology as SkillIcon,
  ArrowBack as BackIcon,
  AutoAwesome as AIIcon,
  PersonOutline as ManualIcon,
  Coffee as CoffeeIcon,
  RocketLaunch as GrowthIcon,
  AddCircleOutline as AddIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Public as WebsiteIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  CalendarMonth as DateIcon,
  Work as WorkSolidIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { db, storage } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useResumeParser } from '../utils/ai/hooks/useResumeParser';

const DEGREES = ['B.Tech', 'B.E.', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'BBA', 'MBA', 'PhD', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni / Graduated'];
const PASS_OUT_YEARS = Array.from({ length: 15 }, (_, i) => (2020 + i).toString());

const TOP_SKILLS = [
  'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'Data Structures',
  'Algorithms', 'Machine Learning', 'SQL', 'AWS', 'Docker', 'System Design'
];

const POPULAR_INDIAN_COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad', 'DTU', 'VIT'
];



export default function ProfilePage() {
  const { user, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(!userData?.onboarded);

  const { parse, loading: parsing } = useResumeParser();

  const [formData, setFormData] = useState({
    experiences: userData?.experiences || [{ company: '', role: '', startDate: '', endDate: '', description: '', current: false }],
    educations: userData?.educations || [{ school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }],
    headline: userData?.headline || '',
    location: userData?.location || '',
    skills: userData?.skills || [],
    linkedin: userData?.linkedin || '',
    resumeUrl: userData?.resumeUrl || '',
    resumeName: userData?.resumeName || ''
  });

  const [resumeFile, setResumeFile] = useState(null);

  // Sync state when userData loads
  useEffect(() => {
    if (userData) {
      setFormData({
        experiences: userData.experiences || [{ company: '', role: '', startDate: '', endDate: '', description: '', current: false }],
        educations: userData.educations || [{ school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }],
        headline: userData.headline || '',
        location: userData.location || '',
        skills: userData.skills || [],
        linkedin: userData.linkedin || '',
        resumeUrl: userData.resumeUrl || '',
        resumeName: userData.resumeName || ''
      });
      if (userData.onboarded) setIsEdit(false);
    }
  }, [userData]);

  const isProfileIncomplete = !formData.headline ||
    formData.skills.length < 2 ||
    (formData.experiences.filter(exp => exp.company).length === 0) ||
    (formData.educations.filter(edu => edu.school).length === 0);

  const handleResumeUpload = async (e) => {
    console.log("ProfilePage: handleResumeUpload triggered", e.target.files);
    const file = e.target.files[0];
    if (!file) {
      console.warn("ProfilePage: No file detected in handleResumeUpload");
      return;
    }
    console.log("ProfilePage: Resume upload initiated:", file.name);
    setResumeFile(file);
    setFormData(prev => ({ ...prev, resumeName: file.name }));
    try {
      console.log("ProfilePage: Starting AI Sync...");
      const parsed = await parse(file);
      console.log("ProfilePage: AI Sync completed successfully:", parsed);
      setFormData(prev => ({
        ...prev,
        headline: parsed.headline || prev.headline,
        skills: Array.isArray(parsed.skills) ? [...new Set([...prev.skills, ...parsed.skills])] : prev.skills,
        experiences: (parsed.experiences && parsed.experiences.length > 0) ? parsed.experiences : prev.experiences,
        educations: (parsed.educations && parsed.educations.length > 0) ? parsed.educations : prev.educations,
        linkedin: parsed.personalInfo?.linkedin || prev.linkedin,
        location: parsed.location || prev.location
      }));
    } catch (err) {
      console.error("ProfilePage: AI Sync failed:", err);
    }
  };

  const addExperience = () => setFormData(p => ({ ...p, experiences: [...p.experiences, { company: '', role: '', startDate: '', endDate: '', description: '', current: false }] }));
  const removeExperience = (i) => setFormData(p => ({ ...p, experiences: p.experiences.filter((_, idx) => idx !== i) }));
  const updateExperience = (i, f, v) => {
    const next = [...formData.experiences];
    next[i][f] = v;
    setFormData(p => ({ ...p, experiences: next }));
  };

  const addEducation = () => setFormData(p => ({ ...p, educations: [...p.educations, { school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }] }));
  const removeEducation = (i) => setFormData(p => ({ ...p, educations: p.educations.filter((_, idx) => idx !== i) }));
  const updateEducation = (i, f, v) => {
    const next = [...formData.educations];
    next[i][f] = v;
    setFormData(p => ({ ...p, educations: next }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let finalResumeUrl = formData.resumeUrl;
      if (resumeFile) {
        const resumeRef = ref(storage, `resumes/${user.uid}/${resumeFile.name}`);
        const snapshot = await uploadBytes(resumeRef, resumeFile);
        finalResumeUrl = await getDownloadURL(snapshot.ref);
      }
      const primaryCollege = formData.educations.find(edu => edu.school)?.school || '';
      const currentCompany = formData.experiences.find(exp => exp.current)?.company || formData.experiences[0]?.company || '';
      await setDoc(doc(db, 'users', user.uid), { ...formData, primaryCollege, currentCompany, resumeUrl: finalResumeUrl, onboarded: true, updatedAt: new Date(), uid: user.uid }, { merge: true });
      await refreshUserData();
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderEditMode = () => (
    <Stack spacing={6}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-2px', mb: 1 }}>
            {userData?.onboarded ? 'Revamp Your Identity' : 'Complete Your Identity'}
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>Sync your history and launch your professional pulse</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {userData?.onboarded && (
            <Button onClick={() => setIsEdit(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
          )}
          <Button
            component="label"
            variant="outlined"
            startIcon={parsing ? <CircularProgress size={20} /> : <AIIcon />}
            disabled={parsing}
            onClick={() => console.log("ProfilePage: AI Sync Button (label) Clicked")}
            sx={{ borderRadius: '14px', py: 1.5, px: 3, border: '1px solid #e2e8f0', color: '#1a365d', fontWeight: 800, textTransform: 'none', bgcolor: '#fff' }}
          >
            <input type="file" hidden accept=".pdf" onChange={handleResumeUpload} />
            {parsing ? 'Syncing...' : 'AI Sync'}
          </Button>
        </Stack>
      </Stack>

      <Box>
        <Typography variant="overline" sx={{ fontWeight: 900, color: '#94a3b8', letterSpacing: '2px', mb: 3, display: 'block' }}>CORE NARRATIVE</Typography>
        <Stack spacing={3}>
          <TextField fullWidth label="1-Line Identity" placeholder="e.g. SDE @ Google or Indie Filmmaker" value={formData.headline} onChange={(e) => setFormData(p => ({ ...p, headline: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#fff' } }} />
          <Autocomplete multiple options={TOP_SKILLS} freeSolo value={formData.skills} onChange={(_, v) => setFormData(p => ({ ...p, skills: v }))} renderTags={(v, g) => v.map((item, i) => <Chip label={item} {...g({ index: i })} sx={{ borderRadius: '10px', fontWeight: 700 }} />)} renderInput={(p) => <TextField {...p} label="Expertise & Passions" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#fff' } }} />} />
          <TextField fullWidth label="Location" placeholder="e.g. Mumbai, India or Remote" value={formData.location} onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#fff' } }} />
          <TextField fullWidth label="LinkedIn / Portfolio" value={formData.linkedin} onChange={(e) => setFormData(p => ({ ...p, linkedin: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#fff' } }} />
        </Stack>
      </Box>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}><Typography variant="overline" sx={{ fontWeight: 900, color: '#94a3b8', letterSpacing: '2px' }}>PROFESSIONAL HISTORY</Typography><Button startIcon={<AddIcon />} onClick={addExperience} sx={{ fontWeight: 800 }}>Add Experience</Button></Stack>
        <Stack spacing={3}>
          {formData.experiences.map((exp, i) => (
            <Paper key={i} sx={{ p: 4, borderRadius: '32px', bgcolor: '#fff', border: '1px solid #e2e8f0', position: 'relative' }}>
              {formData.experiences.length > 1 && <IconButton onClick={() => removeExperience(i)} sx={{ position: 'absolute', top: 12, right: 12 }}><DeleteIcon /></IconButton>}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Organization" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Role" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Start Date" type="month" InputLabelProps={{ shrink: true }} value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="End Date" type="month" InputLabelProps={{ shrink: true }} disabled={exp.current} value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} /></Grid>
                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', alignItems: 'center' }}><FormControlLabel control={<Checkbox checked={exp.current} onChange={(e) => updateExperience(i, 'current', e.target.checked)} />} label="Current" /></Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}><Typography variant="overline" sx={{ fontWeight: 900, color: '#94a3b8', letterSpacing: '2px' }}>ACADEMIC JOURNEY</Typography><Button startIcon={<AddIcon />} onClick={addEducation} sx={{ fontWeight: 800 }}>Add Education</Button></Stack>
        <Stack spacing={3}>
          {formData.educations.map((edu, i) => (
            <Paper key={i} sx={{ p: 4, borderRadius: '32px', bgcolor: '#fff', border: '1px solid #e2e8f0', position: 'relative' }}>
              {formData.educations.length > 1 && <IconButton onClick={() => removeEducation(i)} sx={{ position: 'absolute', top: 12, right: 12 }}><DeleteIcon /></IconButton>}
              <Grid container spacing={3}>
                <Grid size={12}><Autocomplete fullWidth freeSolo options={POPULAR_INDIAN_COLLEGES} value={edu.school} onInputChange={(_, v) => updateEducation(i, 'school', v)} renderInput={(p) => <TextField {...p} label="Institution" />} /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Degree" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Field" value={edu.fieldOfStudy} onChange={(e) => updateEducation(i, 'fieldOfStudy', e.target.value)} /></Grid>
                <Grid size={{ xs: 12, sm: 2 }}><TextField fullWidth label="Start" type="number" value={edu.startYear} onChange={(e) => updateEducation(i, 'startYear', e.target.value)} /></Grid>
                <Grid size={{ xs: 12, sm: 2 }}><TextField fullWidth label="End" type="number" value={edu.endYear} onChange={(e) => updateEducation(i, 'endYear', e.target.value)} /></Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ py: 2, px: 8, borderRadius: '16px', fontWeight: 900, bgcolor: '#0f172a', color: '#fff', textTransform: 'none' }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
        </Button>
      </Box>
    </Stack>
  );

  const renderReadMode = () => (
    <Stack spacing={4}>
      {isProfileIncomplete && (
        <Fade in timeout={1500}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              mb: 2
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 2, borderRadius: '20px', bgcolor: '#fff', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.12)' }}>
                <GrowthIcon sx={{ color: '#3b82f6', fontSize: '2rem' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e3a8a', mb: 0.5 }}>Elevate Your Profile</Typography>
                <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 700, opacity: 0.8 }}>Missing crucial details reduces your career pulse visibility. Add more to shine!</Typography>
              </Box>
            </Stack>
            <Button
              onClick={() => setIsEdit(true)}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#3b82f6',
                color: '#fff',
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                fontWeight: 900,
                textTransform: 'none',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.25)',
                '&:hover': { bgcolor: '#2563eb', transform: 'translateY(-2px)' },
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              Add Info
            </Button>
          </Paper>
        </Fade>
      )}

      {/* Profile Header Card */}
      <Paper sx={{ p: 6, borderRadius: '48px', bgcolor: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(90deg, #f8fafc 0%, #eff6ff 100%)' }} />
        <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ width: 140, height: 140, borderRadius: '50%', border: '6px solid #fff', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <img src={user?.photoURL} alt={user?.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <VerifiedIcon sx={{ position: 'absolute', bottom: 10, right: 10, color: '#3b82f6', bgcolor: '#fff', borderRadius: '50%', fontSize: '2rem' }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-2px', mb: 1 }}>{user?.displayName}</Typography>
            <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 800, mb: 3 }}>{formData.headline}</Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              {formData.skills.map((skill, i) => (
                <Chip key={i} label={skill} sx={{ fontWeight: 800, borderRadius: '10px', bgcolor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0' }} />
              ))}
            </Stack>
            {formData.location && (
               <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                 <LocationIcon sx={{ fontSize: '1rem' }} /> {formData.location}
               </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEdit(true)} sx={{ borderRadius: '14px', px: 4, py: 1.5, fontWeight: 800, bgcolor: '#0f172a' }}>Edit Profile</Button>
            {formData.linkedin && (
              <Button variant="outlined" startIcon={<LinkedInIcon />} href={formData.linkedin} target="_blank" sx={{ borderRadius: '14px', px: 4, color: '#0f172a', border: '2px solid #0f172a' }}>Connect</Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" sx={{ fontWeight: 950, color: '#94a3b8', letterSpacing: '2px', mb: 3, display: 'block' }}>EXPERIENCE</Typography>
          <Stack spacing={3}>
            {formData.experiences.filter(exp => exp.company).length > 0 ? (
              formData.experiences.filter(exp => exp.company).map((exp, i) => (
                <Box key={i} sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 850, mb: 0.5 }}>{exp.role}</Typography>
                  <Typography variant="body1" sx={{ color: '#3b82f6', fontWeight: 800, mb: 1 }}>{exp.company}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DateIcon sx={{ fontSize: '1rem' }} /> {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 4, borderRadius: '32px', border: '2px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>No experience added yet.</Typography>
              </Box>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" sx={{ fontWeight: 950, color: '#94a3b8', letterSpacing: '2px', mb: 3, display: 'block' }}>EDUCATION</Typography>
          <Stack spacing={3}>
            {formData.educations.filter(edu => edu.school).length > 0 ? (
              formData.educations.filter(edu => edu.school).map((edu, i) => (
                <Box key={i} sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 850, mb: 0.5 }}>{edu.degree} in {edu.fieldOfStudy}</Typography>
                  <Typography variant="body1" sx={{ color: '#3b82f6', fontWeight: 800, mb: 1 }}>{edu.school}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EducationIcon sx={{ fontSize: '1rem' }} /> {edu.startYear} — {edu.endYear}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 4, borderRadius: '32px', border: '2px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>No academic info added yet.</Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, #f8fafc 0%, #eff6ff 100%)', py: 4 }}>
      <Container maxWidth="md">
        {userData?.onboarded && (
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 4, fontWeight: 700, color: '#64748b' }}
          >
            Dashboard
          </Button>
        )}
        {isEdit ? renderEditMode() : renderReadMode()}
      </Container>
    </Box>
  );
}
