import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Box,
  Stack,
  Rating,
  Button
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import api, { API_URL } from '@/api'; // 🟢 axios instance with refresh token handling

const TeacherDetails: React.FC = () => {
  const { user } = useAuth();
  const { teacherusername } = useParams<{ teacherusername: string }>();
  const [teacher, setTeacher] = useState<any | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRatings = async (pageNum = 0) => {
    try {
      const { data } = await api.get(`/ratings/${teacherusername}`, {
        params: { page: pageNum, size: 3 },
      });
      setRatings(data.reviews || []);
      setPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      console.error('Failed to fetch ratings:', err.message);
    }
  };

  const fetchAvgRating = async () => {
    try {
      const { data } = await api.get(`/ratings/average/${teacherusername}`);
      setAvgRating(data);
    } catch (err: any) {
      console.error('Failed to fetch average rating:', err.message);
    }
  };

  const fetchTeacher = async () => {
    try {
      const { data } = await api.get(`/api/auth/teacher/${teacherusername}`);
      setTeacher(data);
    } catch (err: any) {
      console.error('Failed to fetch teacher details:', err.message);
    }
  };

  useEffect(() => {
    if (teacherusername) {
      fetchTeacher();
      fetchAvgRating();
      fetchRatings();
    }
  }, [teacherusername]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Avatar
              src={
                teacher?.profileImageUrl
                  ? `${API_URL}${teacher.profileImageUrl}`
                  : undefined
              }
              sx={{ width: 80, height: 80, fontSize: '2rem' }}
            >
              {teacher?.fullName?.charAt(0) || "?"}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {teacher?.fullName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                @{teacher?.username}
              </Typography>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Chip icon={<SchoolIcon />} label="Teacher" color="primary" size="small" />
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={avgRating || 0} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">
                    {avgRating !== null && avgRating > 0 ? avgRating.toFixed(1) : 'NA'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box mt={3} display="flex" flexDirection="column" gap={1.5}>
            <Typography>
              <strong>Subjects:</strong>{' '}
              {Array.isArray(teacher?.subjects)
                ? teacher.subjects.join(', ')
                : teacher?.subjects || 'NA'}
            </Typography>
            <Typography><strong>Experience:</strong> {teacher?.experience || 'NA'}</Typography>
            <Typography><strong>Bio:</strong> {teacher?.bio || 'NA'}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Typography variant="h5">Student Reviews</Typography>
        {ratings?.map((r) => (
          <Card key={r.id} sx={{ mb: 2, p: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle2">@{r.raterFullname}</Typography>
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

export default TeacherDetails;
