import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import api, { API_URL } from "@/api";
import { useNavigate } from "react-router-dom";

const BidList: React.FC = () => {
  const [bids, setBids] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const studentId = user?.id;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // ✅ Delete a single bid
  const handleDeleteBid = async (bidId: number) => {
    try {
      await api.delete(`/api/auth/deletebids/${bidId}`);
      setBids((prev) => prev.filter((b) => b.bidId !== bidId));
      showSnackbar("Bid deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting bid:", err);
      showSnackbar("Failed to delete bid", "error");
    }
  };

  // ✅ Clear all bids by status
  const handleClearBids = async (status: "rejected" | "completed") => {
    try {
      const bidsToDelete = bids.filter(
        (b) => b.status.toLowerCase() === status
      );

      await Promise.all(
        bidsToDelete.map((b) => api.delete(`/api/auth/deletebids/${b.bidId}`))
      );

      setBids((prev) =>
        prev.filter((b) => b.status.toLowerCase() !== status)
      );
      showSnackbar(`Cleared all ${status} bids`, "success");
    } catch (err) {
      console.error(`Error clearing ${status} bids:`, err);
      showSnackbar(`Failed to clear ${status} bids`, "error");
    }
  };

  // ✅ End a gig (use api.put instead of fetch)
  const handleConfirmEndGig = async (bid: any) => {
    try {
      await api.put(`/api/auth/bids/${bid.bidId}/complete`);
      setBids((prev) =>
        prev.map((b) =>
          b.bidId === bid.bidId ? { ...b, status: "completed" } : b
        )
      );
      showSnackbar("Gig marked as completed!", "success");
    } catch (err) {
      console.error("Error ending gig:", err);
      showSnackbar("Failed to end gig", "error");
    } finally {
      setConfirmOpen(false);
      setSelectedBid(null);
    }
  };

  // ✅ Submit rating (use api.post instead of fetch)
  const handleSubmitRating = async () => {
    if (!selectedBid) return;

    const body = {
      raterId: studentId,
      rateeUsername: selectedBid.teacherUsername,
      gigId: selectedBid.gigId,
      score: rating,
      comment,
    };

    try {
      await api.post("/ratings", body);
      showSnackbar("Rating submitted successfully!", "success");
      setOpenDialog(false);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting rating:", err);
      showSnackbar("Failed to submit rating", "error");
    }
  };

  // ✅ Fetch bids (token auto-handled by interceptor)
  useEffect(() => {
    if (!studentId) return;
    api
      .get(`/api/auth/bids/student/${studentId}`)
      .then((res) => setBids(res.data))
      .catch((err) => console.error("Error fetching bids:", err));
  }, [studentId]);

  // ⬇️ Section rendering logic unchanged
  const pendingBids = bids.filter(
    (bid) => bid.status.toLowerCase() === "pending"
  );
  const acceptedBids = bids.filter(
    (bid) => bid.status.toLowerCase() === "accepted"
  );
  const rejectedBids = bids.filter(
    (bid) => bid.status.toLowerCase() === "rejected"
  );
  const completedBids = bids.filter(
    (bid) => bid.status.toLowerCase() === "completed"
  );

  const renderBidSection = (title: string, bids: any[], color: string) => (
    <Box mb={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        px={1}
      >
        <Typography variant="h5" color={color} sx={{ fontWeight: "bold" }}>
          {title} ({bids.length})
        </Typography>

        {(title === "Rejected" || title === "Completed") && bids.length > 0 && (
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
            onClick={() => {
              setDeleteTarget(title.toLowerCase());
              setClearConfirmOpen(true);
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {bids.map((bid) => (
        <Card key={bid.bidId} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              {/* Left side: teacher info */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={
                    bid.teacherProfileImageurl
                      ? `${API_URL}${bid.teacherProfileImageurl}`
                      : undefined
                  }
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: "2rem",
                    border: "2px solid #ddd",
                  }}
                >
                  {bid?.teacherFullName?.charAt(0).toUpperCase() || "?"}
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      cursor: "pointer",
                      color: "primary.main",
                      "&:hover": { color: "primary.dark" },
                    }}
                    onClick={() =>
                      navigate(`/teacher-details/${bid.teacherUsername}`)
                    }
                  >
                    👨‍🏫 Teacher: <strong>{bid.teacherFullName}</strong>
                  </Typography>
                  <Typography>Subject: {bid.subject}</Typography>
                  <Typography>Amount: ₹{bid.bidAmount}</Typography>
                  <Typography>Syllabus: {bid.syllabus}</Typography>
                  <Typography>Class: {bid.grade}</Typography>
                </Box>
              </Box>

              {/* Right side: action buttons */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                gap={1}
              >
                {title === "Accepted" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleConfirmEndGig(bid)}
                  >
                    End Gig
                  </Button>
                )}

                {title === "Completed" && (
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={2}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedBid(bid);
                        setOpenDialog(true);
                      }}
                    >
                      Rate Tutor
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setDeleteTarget(bid);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                )}

                {title === "Rejected" && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setDeleteTarget(bid);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );


  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>My Bids</Typography>
      {renderBidSection('Pending', pendingBids, 'warning')}
      {renderBidSection('Accepted', acceptedBids, 'success')}
      {renderBidSection('Rejected', rejectedBids, 'error')}
      {renderBidSection('Completed', completedBids, 'info')}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm End Gig</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to mark this gig as <strong>Completed</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="contained" color="secondary" onClick={() => handleConfirmEndGig(selectedBid)}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
          {/* Confirm Delete Single Bid */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this bid permanently?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleteTarget && deleteTarget.bidId) {
                handleDeleteBid(deleteTarget.bidId);
              }
              setDeleteConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Clear All */}
      <Dialog
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
      >
        <DialogTitle>Confirm Clear All</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all{" "}
            <strong>{deleteTarget}</strong> bids?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleteTarget === "rejected" || deleteTarget === "completed") {
                handleClearBids(deleteTarget);
              }
              setClearConfirmOpen(false);
            }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

        {/* Rating Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
    Rate Your Tutor
  </DialogTitle>
  <DialogContent>
    <Box display="flex" justifyContent="center" mb={2}>
      <Rating
        size="large"
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
      />
    </Box>
    <TextField
      fullWidth
      multiline
      rows={4}
      label="Write your feedback"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
  </DialogContent>
  <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleSubmitRating}>
      Submit Rating
    </Button>
  </DialogActions>
</Dialog>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        sx={{ width: '100%', boxShadow: 3 }}
        variant="filled"
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>

    </Container>
    
  );
};

export default BidList;
