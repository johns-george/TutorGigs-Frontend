import React, { useState } from "react";
import { Box, Button, TextField, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ForgotUsername() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    setMessage("");

    try {
      await api.post("/api/forgot/forgot-username", { email });
      setMessage(`Your username has been sent to: ${email}`);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8f9fa">
      <Card sx={{ width: 400, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Forgot Username
          </Typography>

          {message && (
            <Typography color={message.includes("sent") ? "primary" : "error"} textAlign="center" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Registered Email"
              type="email"
              fullWidth
              margin="normal"
              required
              disabled={loading} // disable input while loading
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading} // disable button while loading
            >
              {loading ? <CircularProgress size={24} /> : "Send Username"}
            </Button>
          </form>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/login")}
            disabled={loading} // disable navigation while loading
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
