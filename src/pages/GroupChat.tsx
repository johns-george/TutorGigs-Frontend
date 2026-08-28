(window as any).global = window;

import React, { useEffect, useRef, useState } from 'react';
import Linkify from 'linkify-react';
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItemButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Send, ArrowBack, Add, Delete } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '@/contexts/AuthContext';
import api, { API_URL } from '@/api'; // centralized axios instance

type Message = {
  id?: number;
  groupChatId: number;
  senderId: string;
  senderName: string;
  content: string;
  sentAt?: string;
};

const GroupChat: React.FC = () => {
  const navigate = useNavigate();
  const { groupchatId } = useParams<{ groupchatId: string }>();
  const { user, accessToken } = useAuth();
  const groupChatId = Number(groupchatId);

  const [chat, setChat] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [openParticipants, setOpenParticipants] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const linkifyOptions = { target: '_blank', rel: 'noopener noreferrer', className: 'text-blue-500 underline hover:text-blue-700' };
  const mySenderId = user?.id;

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, type });
  };

  // -------------------- Fetch APIs --------------------
  const fetchGroupDetails = async () => {
    try {
      const { data } = await api.get(`/api/chat/${groupChatId}`);
      setChat(data);
      setParticipants(data.participants || []);
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Error fetching group details', 'error');
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/api/chat/${groupChatId}/messages`);
      setMessages(data);
      scrollToBottom();
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Error fetching messages', 'error');
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const { data: chatData } = await api.get(`/api/chat/getchatlist/${user.id}`);
      const privateChats = chatData.filter((c: any) => c.type === 'PRIVATE');

      const userMap = new Map<number, any>();
      privateChats.forEach((chat: any) =>
        chat.participants.forEach((p: any) => {
          if (p.userId !== user.id && !userMap.has(p.userId)) userMap.set(p.userId, p);
        }),
      );
      setAvailableUsers(Array.from(userMap.values()));
      setShowAddModal(true);
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Error fetching users', 'error');
    }
  };

  const addParticipant = async (userId: number) => {
    try {
      await api.post(`/api/chat/${groupChatId}/add`, userId);
      showSnackbar('Participant added successfully!', 'success');
      await fetchGroupDetails();
      setShowAddModal(false);
      setOpenParticipants(true);
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Error adding participant', 'error');
    }
  };

  const removeParticipant = async (userId: number) => {
    try {
      await api.delete(`/api/chat/${groupChatId}/remove/${userId}`);
      showSnackbar('Participant removed successfully!', 'success');
      await fetchGroupDetails();
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || 'Error removing participant', 'error');
    }
  };

  // -------------------- WebSocket --------------------
  useEffect(() => {
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket as any,
      debug: () => {},
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${groupChatId}`, (msg) => {
          if (msg.body) {
            const payload: Message = JSON.parse(msg.body);
            setMessages((prev) => [...prev, payload]);
          }
        });
      },
      onStompError: (frame) => console.error('STOMP error:', frame.headers['message'], frame.body),
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      stompClientRef.current?.deactivate();
      stompClientRef.current = null;
    };
  }, [groupChatId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesRef.current && (messagesRef.current.scrollTop = messagesRef.current.scrollHeight);
    }, 100);
  };

  const sendMessage = () => {
    if (!message.trim() || !stompClientRef.current?.active) return;
    stompClientRef.current.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify({ chatId: groupChatId, senderId: mySenderId, content: message.trim() }) });
    setMessage('');
  };

  useEffect(() => {
    fetchGroupDetails();
    fetchMessages();
  }, [groupChatId]);

  useEffect(scrollToBottom, [messages]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Participant Dialog */}
      <Dialog open={openParticipants} onClose={() => setOpenParticipants(false)}>
        <DialogTitle>
          Group Participants
          {user.role === 'TUTOR' && <IconButton onClick={fetchAvailableUsers} sx={{ ml: 2 }}><Add /></IconButton>}
        </DialogTitle>
        <DialogContent>
          <List>
            {participants.map((p: any) => (
              <ListItem key={p.id} secondaryAction={user.role === 'TUTOR' && p.userId !== user.id && <IconButton edge="end" onClick={() => removeParticipant(p.userId)}><Delete /></IconButton>}>
                <ListItemAvatar><Avatar>{p.fullName?.charAt(0).toUpperCase()}</Avatar></ListItemAvatar>
                <ListItemText primary={p.fullName} secondary={p.role} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
        <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }} onClick={() => setOpenParticipants(true)}>
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{chat?.name?.charAt(0).toUpperCase() || 'G'}</Avatar>
          <Typography variant="h6" fontWeight="bold" sx={{ '&:hover': { textDecoration: 'underline' } }}>{chat?.name || 'Group Chat'}</Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Paper sx={{ height: '60vh', overflowY: 'auto', p: 2, mb: 2 }} ref={messagesRef}>
        <List>
          {messages.map((msg, i) => (
            <ListItem key={i} sx={{ display: 'flex', flexDirection: msg.senderId === mySenderId ? 'row-reverse' : 'row' }}>
              <ListItemAvatar><Avatar>{msg.senderName?.charAt(0).toUpperCase()}</Avatar></ListItemAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.senderId === mySenderId ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>{msg.senderName}</Typography>
                <Box sx={{ bgcolor: msg.senderId === mySenderId ? 'grey.200' : 'grey.100', color: 'text.primary', p: 1.2, borderRadius: 2, wordBreak: 'break-word' }}>
                  <Linkify options={linkifyOptions}>{msg.content}</Linkify>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.3 }}>{msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ''}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Send Message */}
      <Box display="flex" alignItems="center" gap={1}>
        <TextField fullWidth placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
        <IconButton color="primary" onClick={sendMessage}><Send /></IconButton>
      </Box>

      {/* Add Participant Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} fullWidth>
        <DialogTitle>Select User to Add</DialogTitle>
        <DialogContent>
          <List>
            {availableUsers.length === 0 ? (
              <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>No available users found.</Typography>
            ) : (
              availableUsers.map((u: any) => {
                const isAlreadyParticipant = participants.some((p: any) => p.userId === u.userId || p.id === u.userId || p.userId === u.id);
                return (
                  <ListItemButton key={u.userId || u.id} onClick={() => !isAlreadyParticipant && addParticipant(u.userId || u.id)} disabled={isAlreadyParticipant}>
                    <ListItemAvatar><Avatar sx={{ opacity: isAlreadyParticipant ? 0.6 : 1 }}>{u.fullName?.charAt(0).toUpperCase()}</Avatar></ListItemAvatar>
                    <ListItemText primary={u.fullName} secondary={isAlreadyParticipant ? `${u.role} (Already in group)` : u.role} sx={{ opacity: isAlreadyParticipant ? 0.6 : 1 }} />
                  </ListItemButton>
                );
              })
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default GroupChat;
