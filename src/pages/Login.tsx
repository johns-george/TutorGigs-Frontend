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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { encryptPassword, clearPasswordKeyCache } from '../authCrypto';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let encryptedPasswordPayload;
      try {
        encryptedPasswordPayload = await encryptPassword(formData.password);
      } catch (encryptErr) {
        // If encryption fails, the cached key may be stale — clear and retry once
        clearPasswordKeyCache();
        encryptedPasswordPayload = await encryptPassword(formData.password);
      }

      const { data } = await api.post('/api/auth/login', {
        username: formData.username,
        ...encryptedPasswordPayload,
      });

      login(data.accessToken, data.refreshToken, data.user);
      const role = (data.user.role || '').trim().toUpperCase();
      if (role === 'STUDENT') {
        navigate('/explorer', { replace: true });
      } else {
        navigate('/my-gigs', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your TutorGigs account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username or Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              disabled={loading}
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
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box display="flex" justifyContent="space-between" mt={1}>
              <Link component="button" variant="body2" onClick={() => navigate('/forgot-password')} sx={{ textDecoration: 'none' }}>
                Forgot Password?
              </Link>
              <Link component="button" variant="body2" onClick={() => navigate('/forgot-username')} sx={{ textDecoration: 'none' }}>
                Forgot Username?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" gutterBottom>
              Don't have an account?{' '}
              <Link component="button" variant="body2" onClick={() => navigate('/signup')} sx={{ textDecoration: 'none' }}>
                Sign up here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
