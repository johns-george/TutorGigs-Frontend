import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api';

const CreateGig: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    amount: '',
    syllabus: '',
    class: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setSnackbar({ open: true, message: "User not authenticated", severity: "error" });
      return;
    }

    try {
      const payload = {
        subject: formData.subject,
        amount: Number(formData.amount),
        syllabus: formData.syllabus,
        grade: formData.class,
        description: formData.description,
        Username: user.username,
      };

      await api.post('/api/auth/create-gig', payload);
      navigate('/my-gigs');
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || error.message || "Failed to create gig",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>Create New Gig</Typography>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
            <TextField label="Subject" required fullWidth value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            <TextField label="Amount (₹)" type="number" required fullWidth value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
            <TextField label="Syllabus" required fullWidth value={formData.syllabus} onChange={(e) => setFormData({...formData, syllabus: e.target.value})} />
            <TextField label="Class" required fullWidth value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} />
            <TextField label="Description" multiline rows={4} required fullWidth value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained">Submit</Button>
              <Button variant="outlined" onClick={() => navigate('/my-gigs')}>Cancel</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateGig;
