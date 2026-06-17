import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Favorite, FavoriteBorder, Chat, PeopleAlt, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { API_URL } from '../api'; // Axios instance

interface Gig {
  acceptedStudentNames: string[];
  teacherFullName: any;
  id: number;
  subject: string;
  amount: number;
  grade: string;
  studentsAccepted: number;
  syllabus: string;
  teacherUsername: string;
  description: string;
  rating: number;
  profileImageUrl: string;
}

const Explorer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [likedGigs, setLikedGigs] = useState<Set<number>>(new Set());
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState<Map<number, string>>(new Map()); // gigId → status
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [ratings, setRatings] = useState<Map<string, number>>(new Map());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // ✅ Fetch gigs + bids + ratings + wishlist
  useEffect(() => {
    const fetchGigsData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1️⃣ Fetch gigs
        const gigsRes = await api.get(`/api/auth/gigs?page=${page}&size=${size}`);
        const data = gigsRes.data;
        setGigs(data.content);
        setTotalPages(data.totalPages);

        // 2️⃣ Fetch student's placed bids
        const bidRes = await api.get("/api/auth/studentplacedbid");
        const bidData = bidRes.data;
        const bidMap = new Map<number, string>();
        bidData.forEach((b: any) => bidMap.set(b.gigId, b.status));
        setBids(bidMap);

        // 3️⃣ Fetch average ratings for all teachers
        const ratingsMap = new Map<string, number>();
        await Promise.all(
          bidData.map(async (gig: any) => {
            try {
              const ratingRes = await api.get(`/ratings/average/${gig.teacherUsername}`);
              ratingsMap.set(gig.teacherUsername, ratingRes.data);
            } catch {
              ratingsMap.set(gig.teacherUsername, 0);
            }
          })
        );
        setRatings(ratingsMap);

        // 4️⃣ Fetch wishlist
        const wishlistRes = await api.get("/api/auth/getwishlist");
        const wishlistIds: Set<number> = new Set(
          wishlistRes.data.map((w: any) => Number(w.id))
        );
        setLikedGigs(wishlistIds);

      } catch (e: any) {
        console.error("Error fetching Explorer data:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGigsData();
  }, [page, size, api]);

  const subjects = [...new Set(gigs?.map(g => g.subject) || [])];
  const classes = [...new Set(gigs?.map(g => g.grade) || [])];

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch =
      gig.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.teacherUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subjectFilter || gig.subject === subjectFilter;
    const matchesClass = !classFilter || gig.grade === classFilter;
    return matchesSearch && matchesSubject && matchesClass;
  });

  // ✅ Handle wishlist toggle
  const handleLike = async (gigId: number) => {
    const userId = user?.id;
    if (!userId) return showSnackbar("Please log in to manage your wishlist.");

    const alreadyLiked = likedGigs.has(gigId);
    try {
      if (alreadyLiked) {
        await api.delete("/api/auth/removewishlist", { data: { gigId, userId } });
        setLikedGigs(prev => {
          const updated = new Set(prev);
          updated.delete(gigId);
          return updated;
        });
      } else {
        await api.post("/api/auth/addwishlist", { gigId, userId });
        setLikedGigs(prev => new Set(prev).add(gigId));
      }
    } catch (err: any) {
      console.error("Error updating wishlist:", err);
      showSnackbar("Failed to update wishlist", "error");
    }
  };

  // ✅ Place bid
  const handlePlaceBid = (gig: Gig) => {
    setSelectedGig(gig);
    setBidAmount(gig.amount.toString());
    setBidDialogOpen(true);
  };

  const handleSubmitBid = async (gig: Gig) => {
    if (!selectedGig || !bidAmount) return;
    try {
      const savedBid = await api.post("/api/auth/placebid", {
        gigId: selectedGig.id,
        bidAmount: parseFloat(bidAmount),
      });
      showSnackbar("Bid submitted successfully!");
      setBids(prev => new Map(prev).set(selectedGig.id, "PENDING"));
      setBidDialogOpen(false);
      setSelectedGig(null);
      setBidAmount("");
    } catch (err: any) {
      console.error("Error placing bid:", err);
      showSnackbar("Failed to place bid", "error");
    }
  };

  const handleWithdrawBid = async (gig: Gig) => {
    try {
      await api.delete(`/api/auth/withdrawbid/${gig.id}`);
      setBids(prev => {
        const updated = new Map(prev);
        updated.delete(gig.id);
        return updated;
      });
      showSnackbar("Bid withdrawn successfully!");
    } catch (err: any) {
      console.error("Error withdrawing bid:", err);
      showSnackbar("Failed to withdraw bid", "error");
    }
  };

  // ✅ Start chat
  const handleChat = async (teacherUsername: string) => {
    try {
      console.log(user.id);
      const res = await api.post(`/api/chat/private?user1Id=${user.id}&user2Username=${teacherUsername}`,);
      navigate(`/chat/${res.data.id}`);
    } catch (err: any) {
      console.error("Error starting chat:", err);
      showSnackbar("Failed to start chat", "error");
    }
  };

  const truncateText = (text: string | undefined | null, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Find Your Perfect Tutor
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Explore available tutoring gigs and connect with expert educators
        </Typography>
      </Box>

      {/* Filters */}
      <Box mb={4} display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <TextField
          fullWidth
          placeholder="Search by subject, teacher, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Subject</InputLabel>
          <Select value={subjectFilter} label="Subject" onChange={(e) => setSubjectFilter(e.target.value)}>
            <MenuItem value="">All Subjects</MenuItem>
            {subjects.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Class</InputLabel>
          <Select value={classFilter} label="Class" onChange={(e) => setClassFilter(e.target.value)}>
            <MenuItem value="">All Classes</MenuItem>
            {classes.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {filteredGigs.length} gig{filteredGigs.length !== 1 ? 's' : ''} found
      </Typography>

      {/* Gigs Grid */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
       {filteredGigs.map((gig) => {
          const bidStatus = bids.get(gig.id);

          return (
                    <Card
                    key={gig.id}
                    sx={{
                      borderRadius: "16px",
                      boxShadow: 3,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                      display: "flex",
                      flexDirection: "column",
                      position: "relative", // important for absolute positioning
                    }}
                  >
                    {/* ❤️ Wishlist Icon on Top-Right */}
                    <IconButton
                      onClick={() => handleLike(gig.id)}
                      color={likedGigs.has(gig.id) ? "error" : "default"}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,1)",
                          transform: "scale(1.2)",
                        },
                        zIndex: 2,
                      }}
                    >
                      {likedGigs.has(gig.id) ? (
                        <Favorite sx={{ color: "error.main" }} />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>

                    {/* Header with subject and teacher */}
                    <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {gig.subject}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Avatar
                          src={`${API_URL}${gig.profileImageUrl}?t=${new Date().getTime()}`}
                          sx={{ width: 80, height: 80, fontSize: '2rem' }}
                        >
                          {gig?.teacherFullName?.charAt(0)}
                        </Avatar>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: "pointer", fontWeight: "bold" }}
                          onClick={() => navigate(`/teacher-details/${gig.teacherUsername}`)}
                        >
                          {gig?.teacherFullName || gig.teacherUsername}
                        </Typography>
                      </Box>

                      <Rating
                        value={ratings.get(gig.teacherUsername) || 0}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {ratings.get(gig.teacherUsername)
                          ? ratings.get(gig.teacherUsername)
                          : "No rating"}
                      </Typography>
                    </Box>

                    <CardContent sx={{ flex: 1 }}>
                           <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                             <Chip
                               label={`Class ${gig?.grade}`}
                               color="primary"
                               size="small"
                             />
                             <Chip label={gig.syllabus} color="secondary" size="small" />
                             <Chip
                               label={`₹${gig?.amount}`}
                               color="success"
                               size="small"
                               sx={{ fontWeight: "bold" }}
                             />
                           </Box>
                       {/* Accepted Students Count */}
                          <Box mt={1}>
                            <Tooltip
                              title={
                                gig.studentsAccepted ? (
                                  <Box>
                                    {gig.acceptedStudentNames.map((student: string, index: number) => (
                                      <Typography key={index} variant="body2">
                                        {student}
                                      </Typography>
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography variant="body2">No students yet</Typography>
                                )
                              }
                              arrow
                              placement="top"
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={0.5}
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                <PeopleAlt fontSize="small" color="primary" />
                                <Typography variant="body2" color="text.secondary">
                                  {gig.studentsAccepted?gig.studentsAccepted: 0} student
                                  {gig.studentsAccepted? "" : "s"} accepted
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Box>


                           <Typography variant="body2" color="black" sx={{ mb: 2 }}>
                             Description:{gig?.description}
                           </Typography>
                         </CardContent>
                          <Box sx={{ p: 2, pt: 0 }}>
                                       {(() => {
                                         const bidStatus = bids.get(gig.id);
                         
                                         if (bidStatus === "PENDING") {
                                           return (
                                             <Box display="flex" gap={1}>
                                               <Button fullWidth variant="outlined" disabled>
                                                 Bid Submitted
                                               </Button>
                                               <Button
                                                 fullWidth
                                                 variant="contained"
                                                 color="error"
                                                 onClick={() => handleWithdrawBid(gig)}
                                               >
                                                 Withdraw
                                               </Button>
                                             </Box>
                                           );
                                         }
                         
                                         if (bidStatus === "ACCEPTED") {
                                           return (
                                             <Button
                                               fullWidth
                                               variant="contained"
                                               color="success"
                                               disabled
                                             >
                                               Bid Accepted
                                             </Button>
                                           );
                                         }
                         
                                         if (bidStatus === "REJECTED") {
                                           return (
                                             <Button
                                               fullWidth
                                               variant="contained"
                                               onClick={() => handlePlaceBid(gig)}
                                             >
                                               Place Bid Again
                                             </Button>
                                           );
                                         }
                                         if (bidStatus === "COMPLETED") {
                                           return (
                                             <Button fullWidth variant="contained" disabled>
                                               COMPLETED
                                             </Button>
                                           );
                                         }
                         
                                         return (
                                           <Button
                                             fullWidth
                                             variant="contained"
                                             onClick={() => handlePlaceBid(gig)}
                                           >
                                             Place Bid
                                           </Button>
                                         );
                                       })()}
                         
                                       <Button
                                         variant="outlined"
                                         fullWidth
                                         startIcon={<Chat />}
                                         sx={{ mt: 1 }}
                                         onClick={() => handleChat(gig.teacherUsername)}
                                       >
                                         Chat
                                       </Button>
                                     </Box>
            </Card>
          );
        })}
      </Box>
        <Box display="flex" justifyContent="center" mt={4} gap={2}>
  <Button
    disabled={page === 0}
    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
  >
    Previous
  </Button>
  <Typography align="center" variant="body2" sx={{ mt: 1 }}>
    Page {page + 1} of {totalPages}
  </Typography>
  <Button
    disabled={page + 1 >= totalPages}
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next
  </Button>
</Box>

      {/* Bid Dialog */}
     <Dialog
  open={bidDialogOpen}
  onClose={() => setBidDialogOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
     elevation: 24,
    sx: {
      bgcolor: "background.paper", // Ensures proper background
      color: "text.primary",       // Text is visible
    },
  }}
>
  <DialogTitle>Place Your Bid</DialogTitle>
  <DialogContent sx={{ bgcolor: "background.paper" }}>
    {selectedGig && (
      <>
        <Typography variant="h6">
          {selectedGig.subject} - {selectedGig.teacherUsername}
        </Typography>
        <TextField
          fullWidth
          label="Your Bid Amount (₹)"
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          margin="normal"
        />
      </>
    )}

  </DialogContent>
  <DialogActions>
    <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
    <Button variant="contained" onClick={() => handleSubmitBid(selectedGig!)}>
      Submit Bid
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

export default Explorer;
