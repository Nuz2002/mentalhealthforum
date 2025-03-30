import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

/**
 * Hook for listening to real-time messages via WebSocket.
 *
 * @param {number|string} conversationId - The current conversation ID.
 * @param {function} onNewMessage - Callback to append the new message (MessageDTO).
 */
export default function useMessagesSocket(conversationId, onNewMessage) {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    const baseUrl = import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

    const socket = new SockJS(`${baseUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: false, // Set to true if needed for local debugging

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },

      onConnect: () => {
        console.log("🔗 Connected to message socket for conversation", conversationId);

        client.subscribe(`/topic/messages/${conversationId}`, (msg) => {
          try {
            const messageDTO = JSON.parse(msg.body);
            console.log("📨 Real-time message received:", messageDTO);
            onNewMessage(messageDTO);
          } catch (err) {
            console.error("❌ Failed to parse real-time message:", err);
          }
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error (messages):", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
      console.log("🔌 Disconnected from message socket");
    };
  }, [conversationId]);
}
