import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

/**
 * Subscribes to multiple conversation message topics over WebSocket/STOMP.
 *
 * @param {Object} conversationMap - Map of { userId: conversationId }
 * @param {Function} onMessage - Callback to run when a new message is received
 */
export default function useMultiMessageSocket(conversationMap, onMessage) {
  const stompClientRef = useRef(null);

  useEffect(() => {
    const baseUrl = import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

    const socket = new SockJS(`${baseUrl}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: false,

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },

      onConnect: () => {
        Object.values(conversationMap).forEach((conversationId) => {
          if (!conversationId) return;

          const topic = `/topic/messages/${conversationId}`;
          stompClient.subscribe(topic, (message) => {
            try {
              const parsed = JSON.parse(message.body);
              onMessage(parsed);
            } catch (err) {
              console.error("Failed to parse incoming message:", err);
            }
          });
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClientRef.current?.deactivate();
    };
  }, [JSON.stringify(conversationMap)]);
}
