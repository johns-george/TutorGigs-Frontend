import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Avatar, Chip } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import api, { API_URL } from '@/api'; // 🟢 axios instance with refresh token handling

const StudentDetails: React.FC = () => {
  const [student, setStudent] = useState<any | null>(null);
  const { studentUsername } = useParams<{ studentUsername: string }>();
  const { accessToken } = useAuth();

  const fetchStudent = async () => {
    try {
      const { data } = await api.get(`/api/auth/student/${studentUsername}`);
      console.log('Fetched student details:', data);
      setStudent(data);
    } catch (err: any) {
      console.error('Failed to fetch student details:', err.message);
    }
  };

  useEffect(() => {
    if (studentUsername) {
      fetchStudent();
    }
  }, [studentUsername]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Avatar
            src={
              student?.profileImageUrl
                ? `${API_URL}${student.profileImageUrl}?t=${new Date().getTime()}`
                : undefined
            }
            sx={{ width: 80, height: 80, fontSize: '2rem' }}
          >
            {student?.fullName?.charAt(0) || "?"}
          </Avatar>
          <Typography variant="h4" gutterBottom>{student?.fullName}</Typography>
          <Typography variant="h6" color="text.secondary">Username: {student?.username}</Typography>
          <Chip label="Student" color="primary" sx={{ mt: 2, mb: 3 }} />
          <Typography><strong>Email:</strong> {student?.email || 'NA'}</Typography>
          <Typography><strong>Mobile:</strong> {student?.mobile || 'NA'}</Typography>
          <Typography><strong>Date Of Birth:</strong> {student?.dateOfBirth || 'NA'}</Typography>
          <Typography><strong>Grade:</strong> {student?.grade || 'NA'}</Typography>
          <Typography><strong>Bio:</strong> {student?.bio || 'NA'}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentDetails;
