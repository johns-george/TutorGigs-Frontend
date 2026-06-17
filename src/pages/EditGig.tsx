import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api"; // Axios instance with JWT interceptor

interface Gig {
  id: number;
  subject: string;
  amount: number;
  grade: string;
  teacherUsername: string;
  syllabus: string;
  description: string;
}

const EditGig: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const gigId = Number(id);

  // Fetch gig details by ID
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/api/auth/gigs/${gigId}`);
        console.log("Fetched gig:", data);
        setGig(data);
      } catch (error: any) {
        console.error("Error fetching gig:", error);
        alert(error?.response?.data?.message || "Failed to fetch gig");
      } finally {
        setLoading(false);
      }
    };
    if (gigId) fetchGig();
  }, [gigId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gig) return;
    setGig({ ...gig, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig) return;

    try {
      const { data } = await api.put(`/api/auth/edit-gigs/${gigId}`, gig);
      console.log("Updated gig:", data);
      navigate("/my-gigs");
    } catch (error: any) {
      console.error("Error updating gig:", error);
      alert(error?.response?.data?.message || "Failed to update gig");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!gig) return <Typography>Gig not found</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Gig
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Subject"
          name="subject"
          value={gig.subject}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={gig.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Grade"
          name="grade"
          value={gig.grade}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Syllabus"
          name="syllabus"
          value={gig.syllabus}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={gig.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Changes
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, ml: 2 }}
          onClick={() => navigate("/my-gigs")}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default EditGig;
