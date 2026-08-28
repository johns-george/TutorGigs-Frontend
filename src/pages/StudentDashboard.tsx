import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Chip,
} from '@mui/material';
import { Edit, Save, Cancel, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { API_URL } from '@/api'; // 🟢 axios instance with refresh token handling
import { DashboardSkeleton } from '../components/LoadingSkeleton';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.profileImageUrl ? `${API_URL}${user.profileImageUrl}` : ''
  );

  const grade = user?.grade || '';
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    dateOfBirth: user?.dateOfBirth || '',
    grade: user?.grade || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleSave = async () => {
    try {
      // 1️⃣ Update main student data
      const { data: updatedUser } = await api.put(`/api/auth/student-dashboard/${user?.id}`, editData);
      updateUser(updatedUser);

      // 2️⃣ Upload profile picture if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const { data: uploadData } = await api.put(
          `/api/auth/student-dashboard/${user?.id}/upload-photo`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        const newUser = { ...updatedUser, profileImageUrl: uploadData.profileImageUrl };
        updateUser(newUser);
        setPreviewUrl(`${API_URL}${uploadData.profileImageUrl}`);
        setSelectedImage(null);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      fullName: user?.fullName || '',
      mobile: user?.mobile || '',
      dateOfBirth: user?.dateOfBirth || '',
      grade: user?.grade || '',
      email: user?.email || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DashboardSkeleton />
    </Container>
  );

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Student Dashboard
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Box position="relative">
              <Avatar
                src={previewUrl || ''}
                sx={{ width: 80, height: 80, fontSize: '2rem' }}
              >
                {!previewUrl && user?.fullName?.charAt(0)}
              </Avatar>

              {isEditing && (
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    borderRadius: '50%',
                    minWidth: 'auto',
                    padding: '6px',
                  }}
                >
                  <Edit fontSize="small" />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Button>
              )}
            </Box>

            <Box>
              <Typography variant="h4" gutterBottom>
                {user.fullName}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                @{user.username}
              </Typography>
              <Chip label={user.role} color="primary" sx={{ mt: 1 }} />
            </Box>
          </Box>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
            <TextField
              label="Full Name"
              value={isEditing ? editData.fullName : user.fullName}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Mobile"
              value={isEditing ? editData.mobile : user.mobile}
              onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Email"
              value={isEditing ? editData.email : user.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Class"
              value={isEditing ? editData.grade : grade}
              onChange={(e) => setEditData({ ...editData, grade: e.target.value })}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={isEditing ? editData.dateOfBirth : user.dateOfBirth}
              onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
              disabled={!isEditing}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Box />
            <TextField
              label="Bio"
              value={isEditing ? editData.bio : user.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              disabled={!isEditing}
              fullWidth
              multiline
              rows={3}
              sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
            />
          </Box>

          <Box display="flex" gap={2} mt={4}>
            {isEditing ? (
              <>
                <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Assignment />}
              onClick={() => navigate('/bid-list')}
            >
              View My Bids
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentDashboard;
