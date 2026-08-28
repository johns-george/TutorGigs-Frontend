import React, { useEffect, useState } from 'react';
import {
  Drawer, Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar,
  Badge, IconButton, Divider, Chip, useTheme, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Button, Checkbox, ListItemButton,
  Snackbar, Alert
} from '@mui/material';
import { Close, Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { API_URL } from '../api'; // Axios instance

interface ChatListProps {
  open: boolean;
  onClose: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [openGroupWindow, setOpenGroupWindow] = useState(false);
  const userid = user?.id ? Number(user.id) : null;
  const theme = useTheme();

  useEffect(() => {
    const fetchChats = async () => {
      if (!open || !userid) return;
      try {
        const { data } = await api.get(`/api/chat/getchatlist/${userid}`);
        setChats(data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, [open, userid]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, background: theme.palette.background.default } }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">Messages</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {user?.role === "TUTOR" && (
              <Chip
                label="Create Group"
                color="primary"
                clickable
                onClick={() => setOpenGroupWindow(true)}
                sx={{ fontWeight: "bold", borderRadius: 2, px: 1.5, py: 0.5 }}
              />
            )}
            <IconButton onClick={onClose}><Close /></IconButton>
          </Box>
        </Box>
        <Divider />

        {/* Chat List */}
        <List sx={{ px: 0 }}>
          {chats.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
              <Chat sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>No conversations yet</Typography>
              <Typography variant="body2" color="text.disabled" textAlign="center">
                Start chatting with tutors or students to see your conversations here.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Private Chats */}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                Private Chats
              </Typography>
              {chats.filter(c => c.type === 'PRIVATE').length === 0 && (
                <Typography variant="body2" color="text.disabled" sx={{ px: 2 }}>No private chats</Typography>
              )}
              {chats.filter(c => c.type === 'PRIVATE').map((chat) => {
                const otherParticipant =
                  chat.participants[0].userId === user?.id
                    ? chat.participants[1]
                    : chat.participants[0];

                return (
                  <ListItem
                    key={chat.id}
                    onClick={() => { navigate(`/chat/${chat.id}`); onClose(); }}
                    sx={{
                      cursor: 'pointer', borderRadius: 2, mb: 1,
                      bgcolor: theme.palette.background.paper,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={chat.unreadCount} color="error" invisible={chat.unreadCount === 0}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                          <Avatar
                            src={`${API_URL}${otherParticipant.profileImageUrl}`}
                            sx={{ width: 60, height: 60, fontSize: '2rem' }}
                          >
                            {otherParticipant?.fullName?.charAt(0)}
                          </Avatar>
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1" fontWeight={chat.unreadCount > 0 ? 'bold' : 'normal'}>
                        {otherParticipant.fullName}
                      </Typography>}
                      secondary={<Typography variant="body2" color={chat.unreadCount > 0 ? 'text.primary' : 'text.secondary'} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chat.lastMessage}
                      </Typography>}
                    />
                  </ListItem>
                );
              })}

              {/* Group Chats */}
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, px: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                Group Chats
              </Typography>
              {chats.filter(c => c.type === 'GROUP').length === 0 && (
                <Typography variant="body2" color="text.disabled" sx={{ px: 2 }}>No group chats</Typography>
              )}
              {chats.filter(c => c.type === 'GROUP').map((chat) => (
                <ListItem
                  key={chat.id}
                  onClick={() => { navigate(`/chat/create-group/${chat.id}`); onClose(); }}
                  sx={{
                    cursor: 'pointer', borderRadius: 2, mb: 1,
                    bgcolor: theme.palette.background.paper,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>{chat.name.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle1">{chat.name}</Typography>}
                    secondary={<Typography variant="body2" color={chat.unreadCount > 0 ? 'text.primary' : 'text.secondary'} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chat.lastMessage}
                    </Typography>}
                  />
                </ListItem>
              ))}
            </>
          )}
        </List>

        {/* Footer */}
        {chats.length > 0 && (
          <>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Box display="flex" justifyContent="center">
              <Chip label={`${chats.length} conversation${chats.length !== 1 ? 's' : ''}`} size="small" color="primary" variant="outlined" />
            </Box>
          </>
        )}
      </Box>

      <GroupWindow open={openGroupWindow} onClose={() => setOpenGroupWindow(false)} chats={chats} />
    </Drawer>
  );
};

interface GroupWindowProps {
  open: boolean;
  onClose: () => void;
  chats: any[];
}

const GroupWindow: React.FC<GroupWindowProps> = ({ open, onClose, chats }) => {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "error" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !chats) return;
    const uniqueMap = new Map<number, any>();
    chats.forEach(chat => chat.participants.forEach((p: any) => { if (p.userId !== user?.id) uniqueMap.set(p.userId, p); }));
    setMembers(Array.from(uniqueMap.values()));
  }, [open, chats, user?.id]);

  const toggleMember = (userId: number) => {
    setSelected(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleCreate = async () => {
    if (!groupName || selected.length === 0) {
      setSnackbar({ open: true, message: "Please enter a group name and select members.", severity: "error" });
      return;
    }

    try {
      const { data } = await api.post("/api/chat/group", {
        name: groupName,
        userIds: selected,
        adminId: user?.id
      });
      navigate(`/chat/create-group/${data.id}`);
      onClose();
    } catch (err: any) {
      console.error(err);
      setSnackbar({ open: true, message: err?.response?.data?.message || "Error creating group", severity: "error" });
    }
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Group Chat</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Group Name" value={groupName} onChange={e => setGroupName(e.target.value)} sx={{ mb: 2 }} />
        <List>
          {members.map(m => (
            <ListItem key={m.userId} disablePadding>
              <ListItemButton onClick={() => toggleMember(m.userId)} sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemAvatar><Avatar>{m.fullName.charAt(0)}</Avatar></ListItemAvatar>
                <ListItemText primary={m.fullName} sx={{ ml: 1 }} />
                <Checkbox edge="end" checked={selected.includes(m.userId)} onChange={() => toggleMember(m.userId)} onClick={e => e.stopPropagation()} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>Create</Button>
      </DialogActions>      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatList;
