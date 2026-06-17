import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Chat, Check, Close, StopCircle } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api, { API_URL } from '@/api'; // axios instance with token + refresh

const Requests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingBids, setPendingBids] = useState<any[]>([]);
  const [acceptedBids, setAcceptedBids] = useState<any[]>([]);
  const [rejectedBids, setRejectedBids] = useState<any[]>([]);
  const [completedBids, setCompletedBids] = useState<any[]>([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch all requests
  const fetchData = async () => {
    try {
      const { data } = await api.get(`/api/auth/requests/${user?.username}`);
      setPendingBids(data.filter((bid: any) => bid.status === 'PENDING'));
      setAcceptedBids(data.filter((bid: any) => bid.status === 'ACCEPTED'));
      setRejectedBids(data.filter((bid: any) => bid.status === 'REJECTED'));
      setCompletedBids(data.filter((bid: any) => bid.status === 'COMPLETED'));
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to fetch requests', 'error');
    }
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  // Update bid status
  const handleUpdateStatus = async (bidId: number, status: string) => {
    try {
      await api.put(`/api/auth/bids/${bidId}/status`, null, { params: { status } });
      showSnackbar(`Bid ${status.toLowerCase()} successfully`, 'success');
      fetchData();
    } catch (err) {
      console.error(err);
      showSnackbar(`Failed to update bid`, 'error');
    }
  };

  // End Gig
  const handleConfirmEndGig = async (bid: any) => {
    try {
      await api.put(`/api/auth/bids/${bid.id}/complete`);
      setAcceptedBids(prev => prev.filter(b => b.id !== bid.id));
      setCompletedBids(prev => [...prev, { ...bid, status: 'COMPLETED' }]);
      showSnackbar('Gig marked as completed', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to complete gig', 'error');
    }
    setConfirmOpen(false);
    setSelectedBid(null);
  };

  // Delete single bid
  const handleDeleteRequest = async (bidId: number) => {
    try {
      await api.delete(`/api/auth/deletebids/${bidId}`);
      setRejectedBids(prev => prev.filter(b => b.id !== bidId));
      setCompletedBids(prev => prev.filter(b => b.id !== bidId));
      showSnackbar('Request deleted', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to delete request', 'error');
    }
  };

  // Clear all bids of a status
  const handleClearRequests = async (status: 'REJECTED' | 'COMPLETED') => {
    const bidsToDelete = status === 'REJECTED' ? rejectedBids : completedBids;
    try {
      await Promise.all(bidsToDelete.map(b => api.delete(`/api/auth/deletebids/${b.id}`)));
      if (status === 'REJECTED') setRejectedBids([]);
      else setCompletedBids([]);
      showSnackbar(`All ${status.toLowerCase()} requests cleared`, 'success');
    } catch (err) {
      console.error(err);
      showSnackbar(`Failed to clear ${status.toLowerCase()} requests`, 'error');
    }
  };

  // Start chat
  const handleChat = async (studentUsername: string) => {
    try {
      const { data } = await api.post(`/api/chat/private?user1Id=${user?.id}&user2Username=${studentUsername}`);
      navigate(`/chat/${data.id}`);
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to start chat', 'error');
    }
  };

  // Render single bid card
  const renderBidCard = (bid: any, showActions = false) => (
    <Card key={bid.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={bid?.studentProfileImageUrl ? `${API_URL}${bid.studentProfileImageUrl}?t=${Date.now()}` : undefined}
              sx={{ width: 80, height: 80, fontSize: '2rem' }}
            >
              {bid?.studentFullName?.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { color: 'primary.dark' } }}
                onClick={() => navigate(`/student-details/${bid.studentUsername}`)}
              >
                {bid.studentFullName}
              </Typography>
              <Typography>Subject: {bid.gigSubject}</Typography>
              <Typography>Amount: ₹{bid.bidAmount}</Typography>
              <Typography>Date: {new Date(bid.bidDate).toLocaleDateString()}</Typography>
            </Box>
          </Box>

          {showActions && (
            <Box display="flex" gap={1}>
              <Button variant="contained" color="success" startIcon={<Check />} onClick={() => handleUpdateStatus(bid.id, 'ACCEPTED')}>Accept</Button>
              <Button variant="contained" color="error" startIcon={<Close />} onClick={() => handleUpdateStatus(bid.id, 'REJECTED')}>Reject</Button>
            </Box>
          )}

          {bid.status === 'PENDING' && (
            <Button variant="contained" color="info" startIcon={<Chat />} onClick={() => handleChat(bid.studentUsername)}>Chat</Button>
          )}

          {bid.status === 'ACCEPTED' && (
            <Box display="flex" gap={1}>
              <Button variant="contained" color="info" startIcon={<Chat />} onClick={() => handleChat(bid.studentUsername)}>Chat</Button>
              <Button variant="contained" color="error" startIcon={<StopCircle />} onClick={() => { setSelectedBid(bid); setConfirmOpen(true); }}>End Gig</Button>
            </Box>
          )}

          {(bid.status === 'REJECTED' || bid.status === 'COMPLETED') && (
            <Button variant="outlined" color="error" onClick={() => { setDeleteTarget(bid); setDeleteConfirmOpen(true); }}>Delete</Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderSection = (title: string, bids: any[], color: string) => (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" color={color} sx={{ fontWeight: 'bold' }}>{title}</Typography>
        {(title === 'Rejected Requests' || title === 'Completed Requests') && bids.length > 0 && (
          <Button variant="contained" color="error" size="small" onClick={() => { setDeleteTarget(title.includes('Rejected') ? 'REJECTED' : 'COMPLETED'); setClearConfirmOpen(true); }}>Clear All</Button>
        )}
      </Box>
      {bids.length > 0 ? bids.map(bid => renderBidCard(bid, title === 'Pending Requests')) : <Typography>No {title.toLowerCase()}</Typography>}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>Student Requests</Typography>

      {renderSection('Pending Requests', pendingBids, 'warning')}
      {renderSection('Accepted Requests', acceptedBids, 'success')}
      {renderSection('Rejected Requests', rejectedBids, 'error')}
      {renderSection('Completed Requests', completedBids, 'info')}

      {/* Confirm End Gig */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm End Gig</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to mark this gig as <strong>Completed</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={() => handleConfirmEndGig(selectedBid)}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Single */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this request permanently?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => { if (deleteTarget?.id) handleDeleteRequest(deleteTarget.id); setDeleteConfirmOpen(false); }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Clear All */}
      <Dialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)}>
        <DialogTitle>Confirm Clear All</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to clear all <strong>{typeof deleteTarget === 'string' ? deleteTarget.toLowerCase() : ''}</strong> requests?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => { if (deleteTarget) handleClearRequests(deleteTarget); setClearConfirmOpen(false); }}>Clear All</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Requests;
