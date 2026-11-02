import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { API_URL } from "@/api";
import { getAccessToken } from "@/tokenUtils";

const PING_INTERVAL_MS = 30_000;

export type ChatSocketMessage = {
  id?: number;
  chatId?: number;
  senderId?: number | string;
  content?: string;
  sentAt?: string;
  sequenceNumber?: number;
  [key: string]: unknown;
};

type UseChatSocketOptions = {
  chatId?: number;
  onMessage: (payload: ChatSocketMessage) => void;
};

export function useChatSocket({ chatId, onMessage }: UseChatSocketOptions) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!chatId) return;

    const token = getAccessToken();
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      heartbeatIncoming: PING_INTERVAL_MS,
      heartbeatOutgoing: PING_INTERVAL_MS,
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${chatId}`, (msg) => {
          if (msg.body) {
            onMessageRef.current(JSON.parse(msg.body));
          }
        });
        client.subscribe("/user/queue/ping", () => {
          if (client.active) {
            client.publish({ destination: "/app/chat.ping", body: "{}" });
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"], frame.body);
      },
    });

    clientRef.current = client;
    client.activate();

    const pingTimer = window.setInterval(() => {
      if (client.active) {
        client.publish({ destination: "/app/chat.ping", body: "{}" });
      }
    }, PING_INTERVAL_MS);

    return () => {
      window.clearInterval(pingTimer);
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [chatId]);

  const sendChatMessage = useCallback((body: { chatId: number; senderId?: number | string; content: string }) => {
    if (!clientRef.current?.active) return false;
    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(body),
    });
    return true;
  }, []);

  return { connected, sendChatMessage };
}
