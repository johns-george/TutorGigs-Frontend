import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api'; // axios instance with token + refresh

interface Gig {
  acceptedStudentNames: string[];
  id: number;
  subject: string;
  amount: number;
  grade: string;
  studentsAccepted: number;
  syllabus: string;
  teacherUsername: string;
  description: string;
}

const MyGigs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState<number | null>(null);

  const fetchGigs = async () => {
    try {
      const { data } = await api.get('/api/auth/my-gigs');
      setGigs(data);
    } catch (err) {
      console.error('Error fetching gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleDeleteClick = (id: number) => {
    setSelectedGigId(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedGigId) return;
    setOpenDialog(false);

    try {
      await api.delete(`/api/auth/delete-gigs/${selectedGigId}`);
      setGigs(prev => prev.filter(gig => gig.id !== selectedGigId));
    } catch (err) {
      console.error('Error deleting gig:', err);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 6 }} />;

  if (gigs.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography gutterBottom>
          No gigs found. Click "Add Gig" to create one.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/create-gig')}>
          Add Gig
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3">My Gigs</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/create-gig')}>
          Add Gig
        </Button>
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
        {gigs.map(gig => (
          <Card key={gig.id} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{gig.subject}</Typography>
              <Typography>Amount: ₹{gig.amount}</Typography>
              <Typography>Class: {gig.grade}</Typography>
              <Typography>
                Students: {gig.acceptedStudentNames.length > 0 ? gig.acceptedStudentNames.join(', ') : 'No students yet'}
              </Typography>
              <Typography>Description: {gig.description}</Typography>
              <Chip label={gig.syllabus} size="small" sx={{ mt: 1 }} />
            </CardContent>

            <CardActions>
              <Button size="large" startIcon={<Edit />} onClick={() => navigate(`/edit-gig/${gig.id}`)}>Edit</Button>
              <Button size="large" color="error" startIcon={<Delete />} onClick={() => handleDeleteClick(gig.id)}>Delete</Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this gig? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyGigs;
