import React, { useEffect, useRef, useState } from 'react';
import Linkify from 'linkify-react';
import { Box, Container, Typography, TextField, IconButton, Avatar, Paper } from '@mui/material';
import { Send, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuth } from '@/contexts/AuthContext';
import api, { API_URL } from '@/api'; // Axios instance

type Message = {
  id?: number;
  chatId: number;
  senderId: string;
  content: string;
  sentAt?: string;
};

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chatsId } = useParams<{ chatsId: string }>();
  const chatId = Number(chatsId);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [chatDetails, setChatDetails] = useState<any | null>(null);
  const [receiver, setReceiver] = useState<any | null>(null);

  const stompClientRef = useRef<Client | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const linkifyOptions = {
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'text-blue-500 underline hover:text-blue-700'
  };

  // ✅ Fetch chat details
  useEffect(() => {
    if (!chatId) return;

    const fetchChatDetails = async () => {
      try {
        const { data } = await api.get(`/api/chat/${chatId}`);
        setChatDetails(data);

        const other = data.participants.find((p: any) => p.userId !== user?.id);
        setReceiver(other);
      } catch (err) {
        console.error("Failed to fetch chat info", err);
      }
    };

    fetchChatDetails();
  }, [chatId, user?.id]);

  // ✅ Fetch chat history
  useEffect(() => {
    if (!chatId) return;

    const fetchChatHistory = async () => {
      try {
        const { data } = await api.get(`/api/chat/${chatId}/messages`);
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };

    fetchChatHistory();
  }, [chatId]);

  // ✅ WebSocket connection
  useEffect(() => {
    if (!chatId) return;
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket as any,
      debug: () => {},
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${chatId}`, (msg) => {
          if (msg.body) {
            const payload: Message = JSON.parse(msg.body);
            setMessages(prev => [...prev, payload]);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"], frame.body);
      },
      reconnectDelay: 5000,
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [chatId]);

  // ✅ Scroll to bottom on new message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Send message
  const sendMessage = () => {
    if (!message.trim() || !stompClientRef.current?.active) return;

    const dto = {
      chatId,
      senderId: user?.id,
      content: message.trim()
    };

    stompClientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(dto),
    });

    setMessage("");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, height: "80vh", display: "flex", flexDirection: "column" }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>

        {receiver && (
          <>
            <Avatar
              src={`${API_URL}${receiver.profileImageUrl}?t=${new Date().getTime()}`}
              sx={{ width: 60, height: 60, fontSize: '2rem' }}
            >
              {receiver?.fullName?.charAt(0)}
            </Avatar>
            <Typography variant="h6">{receiver.fullName}</Typography>
          </>
        )}

        <Typography variant="body2" sx={{ ml: 2 }}>
          {connected ? "Connected" : "Connecting..."}
        </Typography>
      </Box>

      <Paper
        sx={{ flex: 1, p: 2, mb: 2, overflow: "auto", bgcolor: "background.default", color: "text.primary" }}
        ref={messagesRef}
      >
        {receiver && messages.map((msg, idx) => {
          const isMine = msg.senderId === user?.id;
          const avatarSrc = isMine
            ? user?.profileImageUrl && `${API_URL}${user.profileImageUrl}?t=${new Date().getTime()}`
            : receiver?.profileImageUrl && `${API_URL}${receiver.profileImageUrl}?t=${new Date().getTime()}`;
          const avatarLetter = isMine
            ? user?.fullName?.charAt(0).toUpperCase() || "?"
            : receiver?.fullName?.charAt(0).toUpperCase() || "?";

          return (
            <Box key={idx} display="flex" justifyContent={isMine ? "flex-end" : "flex-start"} mb={1}>
              {!isMine && (
                <Box display="flex" alignItems="center" mr={1}>
                  <Avatar src={avatarSrc} sx={{ width: 32, height: 32 }}>{!avatarSrc && avatarLetter}</Avatar>
                </Box>
              )}

              <Paper
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: isMine ? "primary.secondary" : "background.paper",
                  color: isMine ? "primary.main" : "text.primary",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Linkify options={linkifyOptions}>
                  <Typography sx={{ wordBreak: 'break-word' }}>{msg.content}</Typography>
                </Linkify>
                <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: isMine ? "primary.main" : "text.secondary" }}>
                  {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : ""}
                </Typography>
              </Paper>

              {isMine && (
                <Box display="flex" alignItems="center" ml={1}>
                  <Avatar
                    src={avatarSrc}
                    sx={{ width: 32, height: 32, bgcolor: "primary.main", color: "primary.contrastText" }}
                  >
                    {!avatarSrc && avatarLetter}
                  </Avatar>
                </Box>
              )}
            </Box>
          );
        })}
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
        />
        <IconButton color="primary" onClick={sendMessage}><Send /></IconButton>
      </Box>
    </Container>
  );
};

export default ChatPage;
