import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { encryptPassword } from '../authCrypto';


const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as 'STUDENT' | 'TUTOR',
    dateOfBirth: '',
    bio: '',
    // Student specific
    class: '',
    // Teacher specific
    subjects: '',
    experiences: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Account Info', 'Personal Details', 'Complete'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleNext = async() => {
    if (activeStep === 0) {
      if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
      try {
      // ✅ Check username availability
      const { data: available } = await api.get(`/api/auth/check-username/${formData.username}`);
      if (!available) {
        setError("Username already exists. Please choose another one.");
        return; // ❌ stop here
      }
    } catch (err: any) {
      setError(err.message || "Failed to validate username");
      return;
    }
  
    
    if (activeStep === 1) {
      if (!formData.mobile || !formData.dateOfBirth) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.role === 'STUDENT' && !formData.class) {
        setError('Please specify your class');
        return;
      }
      if (formData.role === 'TUTOR' && !formData.subjects) {
        setError('Please specify your subjects');
        return;
      }
    }

    setError('');
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const encryptedPasswordPayload = await encryptPassword(formData.password);

    // Build request object for backend
  const payload = {
  fullName: formData.fullName,
  username: formData.username,
  email: formData.email,
  mobile: Number(formData.mobile), // backend expects Long
  ...encryptedPasswordPayload,
  role: formData.role, // "STUDENT" or "TUTOR"
  dateOfBirth: formData.dateOfBirth,
  bio: formData.bio,
  ...(formData.role === "STUDENT" && { grade: Number(formData.class) }),
  ...(formData.role === "TUTOR" && {
    subjects: formData.subjects,
    experience: formData.experiences,
  }),
};

    const { data } = await api.post('/api/auth/signup', payload);
    const { accessToken, refreshToken, user } = data;
  
    // Update AuthContext with backend response
    login(accessToken, refreshToken,user);

    // Redirect based on role
    //console.log(savedUser);
    const redirectPath = user.role === 'STUDENT' ? '/explorer' : '/my-gigs';
    navigate(redirectPath, { replace: true });

  } catch (err: any) {
    setError(err.response?.data?.message || err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">I am a:</FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel value="STUDENT" control={<Radio />} label="Student" />
                <FormControlLabel value="TUTOR" control={<Radio />} label="Tutor" />
              </RadioGroup>
            </FormControl>
          </>
        );
        
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            
            {formData.role === 'STUDENT' && (
              <TextField
                fullWidth
                label="Class/Grade"
                name="class"
                value={formData.class}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="e.g., Grade 12, Class X"
              />
            )}
            
            {formData.role === 'TUTOR' && (
              <>
                <TextField
                  fullWidth
                  label="Subjects (comma separated)"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                />
                
                <TextField
                  fullWidth
                  label="Experience"
                  name="experiences"
                  value={formData.experiences}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Tell us about your teaching experience..."
                />
              </>
            )}
            
            <TextField
              fullWidth
              label="Bio (Optional)"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              placeholder="Tell us a little about yourself..."
            />
          </>
        );
        
      case 2:
        return (
          <Box textAlign="center" py={4}>
            <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Ready to Get Started!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Click "Create Account" to complete your registration and start your journey with TutorGigs.
            </Typography>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Join TutorGigs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account and start learning or teaching today
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Account'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => navigate('/login')}
                sx={{ textDecoration: 'none' }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
