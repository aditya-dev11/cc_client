import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { saveUserProfile } from '../services/firestoreService';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal Details', 'Professional Info', 'Social Media'];

function OnboardingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');

    // Step 1: Personal Details
    const [birthday, setBirthday] = useState('');
    const [marriageDay, setMarriageDay] = useState('');
    const [interests, setInterests] = useState('');

    // Step 2: Professional (Resume)
    // Mocking resume functionality for this step
    const [profession, setProfession] = useState('');
    const [skills, setSkills] = useState('');

    // Step 3: Social Media
    const [youtube, setYoutube] = useState('');
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            // Final Submit
            try {
                setError('');
                await saveUserProfile(user.uid, {
                    birthday,
                    marriageDay,
                    interests,
                    profession,
                    skills,
                    socialLinks: {
                        youtube,
                        instagram,
                        facebook
                    },
                    onboardingCompleted: true
                });
                navigate('/');
            } catch (err) {
                setError("Failed to save profile details. Please try again.");
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Personal Connections</Typography>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Birthday"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Marriage Day (Optional)"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={marriageDay}
                            onChange={(e) => setMarriageDay(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Interests (comma separated)"
                            placeholder="e.g. Hiking, Coding, Photography"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Professional & Career</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Upload your resume for automatic parsing, or fill in manually.
                        </Typography>
                        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                            Upload Resume (PDF)
                            <input type="file" hidden accept=".pdf" disabled />
                        </Button>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Current Profession"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Key Skills"
                            placeholder="e.g. React, Node.js, Design"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Connect Your World</Typography>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Instagram Username"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="YouTube Channel URL"
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Facebook Profile URL"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                        />
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center" sx={{ mb: 3 }}>
                    Welcome to Manam
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Let's setup your profile so you can connect with your Groups seamlessly.
                </Typography>

                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <React.Fragment>
                    {getStepContent(activeStep)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        {activeStep !== 0 && (
                            <Button onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            onClick={handleNext}
                        >
                            {activeStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            </Paper>
        </Container>
    );
}

export default OnboardingPage;
