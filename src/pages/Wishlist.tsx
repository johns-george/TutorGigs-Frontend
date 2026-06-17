import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Rating,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { FavoriteSharp, Chat, PeopleAlt } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api, { API_URL } from "@/api"; // centralized axios instance with token handling

interface Gig {
  id: number;
  subject: string;
  amount: number;
  grade: string;
  syllabus: string;
  description: string;
  teacherUsername: string;
  acceptedStudentNames: string[];
  rating: number;
  profileImageUrl?: string;
  teacherFullName?: string;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlistedGigs, setWishlistedGigs] = useState<Gig[]>([]);
  const [bids, setBids] = useState<Map<number, string>>(new Map());
  const [ratings, setRatings] = useState<Map<string, number>>(new Map());
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchWishlist = async () => {
    try {
      const { data: gigsData } = await api.get("/api/auth/getwishlist");
      setWishlistedGigs(gigsData);

      // Fetch student bids
      const { data: bidData } = await api.get("/api/auth/studentplacedbid");
      const bidMap = new Map<number, string>();
      bidData.forEach((b: any) => bidMap.set(b.gigId, b.status));
      setBids(bidMap);

      // Fetch ratings
      const ratingsMap = new Map<string, number>();
      await Promise.all(
        gigsData.map(async (gig: Gig) => {
          try {
            const { data: rating } = await api.get(`/ratings/average/${gig.teacherUsername}`);
            ratingsMap.set(gig.teacherUsername, rating);
          } catch {
            ratingsMap.set(gig.teacherUsername, 0);
          }
        })
      );
      setRatings(ratingsMap);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load wishlist", "error");
    }
  };

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handlePlaceBid = (gig: Gig) => {
    setSelectedGig(gig);
    setBidAmount(gig.amount.toString());
    setBidDialogOpen(true);
  };

  const handleSubmitBid = async () => {
    if (!selectedGig) return;

    try {
      const { data: savedBid } = await api.post("/api/auth/placebid", {
        gigId: selectedGig.id,
        bidAmount: parseFloat(bidAmount),
      });
      setBids(prev => new Map(prev).set(selectedGig.id, "PENDING"));
      showSnackbar("Bid submitted successfully");
      setBidDialogOpen(false);
      setSelectedGig(null);
      setBidAmount("");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to submit bid", "error");
    }
  };

  const handleWithdrawBid = async (gigId: number) => {
    try {
      await api.delete(`/api/auth/withdrawbid/${gigId}`);
      setBids(prev => {
        const updated = new Map(prev);
        updated.delete(gigId);
        return updated;
      });
      showSnackbar("Bid withdrawn successfully");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to withdraw bid", "error");
    }
  };

  const handleChat = async (teacherUsername: string) => {
    try {
      const { data } = await api.post(`/api/chat/private?user1Id=${user?.id}&user2Username=${teacherUsername}`);
      navigate(`/chat/${data.id}`);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to start chat", "error");
    }
  };

  const removeFromWishlist = async (gigId: number) => {
    try {
      await api.delete("/api/auth/removewishlist", { data: { gigId, userId: user?.id } });
      setWishlistedGigs(prev => prev.filter(gig => gig.id !== gigId));
      showSnackbar("Removed from wishlist");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to remove from wishlist", "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        My Wishlist
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={3}>
        {wishlistedGigs.map(gig => {
          const bidStatus = bids.get(gig.id);
          return (
            <Card key={gig.id} sx={{ borderRadius: 2, boxShadow: 3, display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar src={gig.profileImageUrl ? `${API_URL}${gig.profileImageUrl}` : undefined}>
                    {gig.teacherFullName?.charAt(0) || "?"}
                  </Avatar>
                  <Typography variant="body1" sx={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate(`/teacher-details/${gig.teacherUsername}`)}>
                    {gig.teacherFullName || gig.teacherUsername}
                  </Typography>
                </Box>
                <Rating value={ratings.get(gig.teacherUsername) || 0} precision={0.1} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  {ratings.get(gig.teacherUsername) ? ratings.get(gig.teacherUsername) : "No rating"}
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1} mb={1}>
                  <Chip label={`Class ${gig.grade}`} color="primary" size="small" />
                  <Chip label={gig.syllabus} color="secondary" size="small" />
                  <Chip label={`₹${gig.amount}`} color="success" size="small" />
                </Box>
                <Typography variant="body2" color="text.primary" mb={1}>
                  {gig.description}
                </Typography>
                <Tooltip
                  title={
                    gig.acceptedStudentNames?.length
                      ? gig.acceptedStudentNames.join(", ")
                      : "No students yet"
                  }
                >
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
                    <PeopleAlt fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {gig.acceptedStudentNames?.length || 0} student(s) accepted
                    </Typography>
                  </Box>
                </Tooltip>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                {bidStatus === "PENDING" && (
                  <Box display="flex" gap={1}>
                    <Button fullWidth variant="outlined" disabled>
                      Bid Submitted
                    </Button>
                    <Button fullWidth variant="contained" color="error" onClick={() => handleWithdrawBid(gig.id)}>
                      Withdraw
                    </Button>
                  </Box>
                )}
                {bidStatus === "ACCEPTED" && <Button fullWidth variant="contained" color="success" disabled>Bid Accepted</Button>}
                {bidStatus === "REJECTED" && <Button fullWidth variant="contained" onClick={() => handlePlaceBid(gig)}>Place Bid Again</Button>}
                {!bidStatus && <Button fullWidth variant="contained" onClick={() => handlePlaceBid(gig)}>Place Bid</Button>}

                <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => handleChat(gig.teacherUsername)}>
                  Chat
                </Button>

                <Button fullWidth variant="text" color="error" sx={{ mt: 1 }} onClick={() => removeFromWishlist(gig.id)}>
                  Remove from Wishlist
                </Button>
              </Box>
            </Card>
          );
        })}
      </Box>

      <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Place Your Bid</DialogTitle>
        <DialogContent>
          {selectedGig && (
            <>
              <Typography variant="h6">{selectedGig.subject} - {selectedGig.teacherUsername}</Typography>
              <TextField fullWidth label="Your Bid Amount (₹)" type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} margin="normal" />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitBid}>Submit Bid</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Wishlist;
