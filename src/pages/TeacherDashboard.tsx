import React, { useEffect, useState } from 'react';
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
  Rating,
} from '@mui/material';
import { Edit, Save, Cancel, Work, AssignmentTurnedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { API_URL } from '@/api'; // 🟢 axios instance with refresh token handling
import { DashboardSkeleton } from '../components/LoadingSkeleton';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.profileImageUrl ? `${API_URL}${user.profileImageUrl}` : ''
  );
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getSubjectsString = (subjects: string | string[] | undefined): string =>
    !subjects ? '' : Array.isArray(subjects) ? subjects.join(', ') : subjects;

  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    dateOfBirth: user?.dateOfBirth || '',
    subjects: getSubjectsString(user?.subjects),
    email: user?.email || '',
    experience: user?.experience || '',
    bio: user?.bio || '',
  });

  // 🟢 Fetch ratings with axios
  const fetchRatings = async (pageNum = 0) => {
    try {
      const { data } = await api.get(`/ratings/${user.username}`, { params: { page: pageNum, size: 3 } });
      setRatings(data.reviews || []);
      setPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      console.error('Failed to fetch ratings:', err.message);
    }
  };

  const fetchAvgRating = async () => {
    try {
      const { data } = await api.get(`/ratings/average/${user.username}`);
      setAvgRating(data);
    } catch (err: any) {
      console.error('Failed to fetch average rating:', err.message);
    }
  };

  const handleSave = async () => {
    try {
      // 1️⃣ Update main user details
      const { data: updatedUser } = await api.put(`/api/auth/teacher-dashboard/${user.id}`, editData);
      updateUser(updatedUser);

      // 2️⃣ Upload profile picture if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const { data: uploadData } = await api.put(
          `/api/auth/student-dashboard/${user.id}/upload-photo`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const newUser = { ...updatedUser, profileImageUrl: uploadData.profileImageUrl };
        updateUser(newUser);
        setSelectedImage(null);
        setPreviewUrl(`${API_URL}${uploadData.profileImageUrl}`);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchAvgRating();
      fetchRatings();
    }
  }, [user?.username]);

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DashboardSkeleton />
    </Container>
  );

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Teacher Dashboard
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
              <Typography variant="h4" gutterBottom>{user.fullName}</Typography>
              <Typography variant="h6" color="text.secondary">@{user.username}</Typography>
              <Box display="flex" gap={1} mt={2}>
                <Chip label={user.role} color="primary" />
                <Chip label={`₹${user.revenueEarned || 0} earned`} color="success" />
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={avgRating || 0} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">{avgRating !== null && avgRating > 0 ? avgRating.toFixed(1) : 'NA'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
            <TextField label="Full Name" value={isEditing ? editData.fullName : user.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} disabled={!isEditing} fullWidth />
            <TextField label="Mobile" value={isEditing ? editData.mobile : user.mobile} onChange={(e) => setEditData({ ...editData, mobile: e.target.value })} disabled={!isEditing} fullWidth />
            <TextField label="Email" value={isEditing ? editData.email : user.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} disabled={!isEditing} fullWidth />
            <TextField label="Subjects" value={isEditing ? editData.subjects : getSubjectsString(user?.subjects)} onChange={(e) => setEditData({ ...editData, subjects: e.target.value })} disabled={!isEditing} fullWidth />
            <TextField label="Date of Birth" type="date" value={isEditing ? editData.dateOfBirth : user.dateOfBirth} onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })} disabled={!isEditing} fullWidth InputLabelProps={{ shrink: true }} />
            <Box />
            <TextField label="Experience" value={isEditing ? editData.experience : user.experience} onChange={(e) => setEditData({ ...editData, experience: e.target.value })} disabled={!isEditing} fullWidth multiline rows={2} sx={{ gridColumn: { xs: '1', md: '1 / -1' } }} />
            <TextField label="Bio" value={isEditing ? editData.bio : user.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} disabled={!isEditing} fullWidth multiline rows={3} sx={{ gridColumn: { xs: '1', md: '1 / -1' } }} />
          </Box>

          <Box display="flex" gap={2} mt={4} flexWrap="wrap">
            {isEditing ? (
              <>
                <Button variant="contained" startIcon={<Save />} onClick={handleSave}>Save Changes</Button>
                <Button variant="outlined" startIcon={<Cancel />} onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
            <Button variant="outlined" startIcon={<Work />} onClick={() => navigate('/my-gigs')}>My Gigs</Button>
            <Button variant="outlined" startIcon={<AssignmentTurnedIn />} onClick={() => navigate('/requests')}>Requests</Button>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Typography variant="h5">Student Reviews</Typography>
        {ratings?.map((r) => (
          <Card key={r.id} sx={{ mb: 2, p: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight="bold">{r.raterFullname}</Typography>
              <Rating value={r.score} readOnly size="small" />
            </Box>
            <Typography variant="body2">{r.comment || "No comment"}</Typography>
          </Card>
        ))}

        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button disabled={page === 0} onClick={() => fetchRatings(page - 1)}>Prev</Button>
          <Typography alignSelf="center">Page {page + 1} of {totalPages}</Typography>
          <Button disabled={page >= totalPages - 1} onClick={() => fetchRatings(page + 1)}>Next</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TeacherDashboard;
