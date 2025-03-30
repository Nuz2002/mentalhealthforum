import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getOnlineUsers } from "../../api-calls/presenceApi";

/**
 * Real-time user presence hook.
 * Maintains a map of { email → { online, lastSeen } } using WebSocket STOMP events.
 */
export default function usePresence(currentUserEmail) {
  const [onlineMap, setOnlineMap] = useState({});
  const stompClientRef = useRef(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    const socket = new SockJS(`${baseUrl}/ws`);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: false, // Set to true if you want verbose logs during dev

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },

      onConnect: async () => {
        stompClient.subscribe("/topic/presence", (message) => {
          try {
            const body = message?.body?.trim();
            if (!body) return;

            const presenceUpdate = JSON.parse(body);

            if (presenceUpdate?.email) {
              setOnlineMap((prev) => ({
                ...prev,
                [presenceUpdate.email]: presenceUpdate,
              }));
            }
          } catch (err) {
            console.error("❌ Failed to parse presence message:", err);
          }
        });

        try {
          const onlineEmails = await getOnlineUsers();
          setOnlineMap((prev) => {
            const updated = { ...prev };
            onlineEmails.forEach((email) => {
              if (!updated[email]) {
                updated[email] = {
                  email,
                  online: true,
                  lastSeen: null,
                };
              }
            });
            return updated;
          });
        } catch (err) {
          console.error("❌ Failed to fetch initial online users:", err);
        }
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
  }, [currentUserEmail]);

  return onlineMap;
}
