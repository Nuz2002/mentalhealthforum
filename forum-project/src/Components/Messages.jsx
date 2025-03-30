import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { markMessagesAsRead } from "../api-calls/messageApi";
import {
  getConversationUsers,
  startConversation,
  getMessagesPage,
  sendMessageToConversation,
} from "../api-calls/conversationApi";

import defaultProfilePic from "../assets/default-profile.png";
import VerifiedCheckmark from "../Components/VerifiedCheckMark";
import usePresence from "./hooks/usePresence";
import useMultiMessageSocket from "./hooks/useMultiMessageSocket";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationMap, setConversationMap] = useState({});
  const [messages, setMessages] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const { username } = useParams();
  const location = useLocation();
  const hasInitialized = useRef(false);

  // Decode current user from token
  const token = localStorage.getItem("accessToken");
  let currentUser = null;
  if (token) {
    const decoded = jwtDecode(token);
    currentUser = { email: decoded.sub };
  }

  // Track online/offline presence
  const onlineMap = usePresence(currentUser?.email);

  // Handle incoming WebSocket messages
  useMultiMessageSocket(conversationMap, (incomingMsg) => {
    if (!incomingMsg || !incomingMsg.senderEmail) return;

    // Figure out which user (peer) this message is for
    const peerEmail =
      incomingMsg.senderEmail === currentUser.email
        ? // If I'm the sender, the peer is the recipient (or the selected user as fallback)
          incomingMsg.recipientEmail || selectedUser?.email
        : // If I'm the receiver, the peer is the sender
          incomingMsg.senderEmail;

    // If the message is for a conversation I'm NOT currently viewing, increment unread count
    if (peerEmail !== selectedUser?.email) {
      setUnreadCounts((prev) => ({
        ...prev,
        [peerEmail]: (prev[peerEmail] || 0) + 1,
      }));

      if (hasInitialized.current) {
        setUsers((prevUsers) => {
          const updated = [...prevUsers];
          const idx = updated.findIndex((u) => u.email === peerEmail);
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              lastMessageAt: incomingMsg.sentAt || new Date().toISOString(),
            };
            updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
          }
          return updated;
        });
      }
      

    }


    // If I'm currently looking at this conversation OR I'm the sender, add it to the UI
    if (peerEmail === selectedUser?.email || incomingMsg.senderEmail === currentUser.email) {
      setMessages((prev) => {
        const existing = prev[peerEmail] || [];
        // Deduplicate using the unique message ID from the backend
        const isDuplicate = existing.some((msg) => msg.id === incomingMsg.id);
        if (isDuplicate) return prev;

        return {
          ...prev,
          [peerEmail]: [...existing, incomingMsg],
        };
      });
    }
  });

  // Load initial user list and optionally auto-select a conversation
  useEffect(() => {
    getConversationUsers()
      .then(async (data) => {

        // ✅ Sort by lastMessageAt (most recent first)
        const sorted = data.slice().sort((a, b) => {
          const aTime = a.lastMessageAt ? new Date(a.lastMessageAt) : new Date(0);
          const bTime = b.lastMessageAt ? new Date(b.lastMessageAt) : new Date(0);
          return bTime - aTime;
        });
  
        setUsers(sorted);
        hasInitialized.current = true;
  
        // ✅ Extract unread message counts into a map
        const unreadMap = {};
        sorted.forEach(user => {
          if (user.unreadCount && user.unreadCount > 0) {
            unreadMap[user.email] = user.unreadCount;
          }
        });
        setUnreadCounts(unreadMap);
  
        // ✅ If a username is provided in the URL, try to select that conversation
        if (username) {
          let found = sorted.find((u) => u.username === username);
          if (!found && location.state?.user) {
            found = location.state.user;
          }
          if (found) {
            setSelectedUser(found);
            setShowChat(true);
            await loadMessages(found);
          }
        } else if (sorted.length > 0) {
          // ✅ Fallback to the first user in the sorted list
          setSelectedUser(sorted[0]);
          setShowChat(true);
          await loadMessages(sorted[0]);
        }
      })
      .catch(console.error);
  }, [username]);
  

  const loadMessages = async (user) => {
    try {
      let convoId = conversationMap[user.email];
      if (!convoId) {
        const conversation = await startConversation(user.email);
        convoId = conversation.id;
        setConversationMap((prev) => ({
          ...prev,
          [user.email]: convoId,
        }));
      }
  
      const msgs = await getMessagesPage(convoId);
      setMessages((prev) => ({ ...prev, [user.email]: msgs }));
  
      // ✅ Mark as read on the server
      await markMessagesAsRead(convoId);
  
      // ✅ Update local unread badge state
      setUnreadCounts((prev) => ({
        ...prev,
        [user.email]: 0,
      }));
    } catch (err) {
      console.error("Не удалось загрузить сообщения:", err);
    }
  };
  
  

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser || !currentUser) return;
  
    const conversationId = conversationMap[selectedUser.email];
    if (!conversationId) {
      console.error("ID переписки не найден.");
      return;
    }
  
    const messageText = input.trim();
    setInput("");
  
    try {
      // Send the message to the server
      await sendMessageToConversation(conversationId, messageText);
      // Refresh the messages for the current conversation (behind the scenes)
      await loadMessages(selectedUser);

      setUsers((prevUsers) => {
        const updated = [...prevUsers];
        const idx = updated.findIndex((u) => u.email === selectedUser.email);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            lastMessageAt: new Date().toISOString(),
          };
          updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        }
        return updated;
      });

      
    } catch (error) {
      console.error("Не удалось отправить сообщение:", error);
    }
  };
  

  // Render
  return (
    <div className="flex flex-col md:flex-row h-[calc(100dvh-4rem)] border-2 border-blue-100 rounded-xl shadow-lg overflow-hidden bg-white">
      {/* Sidebar with conversations */}
      <div
        className={`w-full md:w-1/4 bg-blue-50 p-4 overflow-y-auto border-b-2 md:border-r-2 border-blue-100 ${
          showChat ? "hidden md:block" : "block"
        }`}
      >
        <h2 className="text-blue-900 text-lg font-semibold mb-4 px-2">
          Переписки
        </h2>
        {users.length === 0 ? (
          <p className="text-blue-700 text-sm px-2 italic">
            У вас пока нет сообщений.
          </p>
        ) : (
          users
            .map((user) => {
              const isSelected = selectedUser?.email === user.email;
              const unreadCount = unreadCounts[user.email] || 0;

              return (
                <div
                  key={user.email}
                  className={`relative flex items-center p-2 sm:p-3 cursor-pointer rounded-xl transition-all mb-2 ${
                    isSelected ? "bg-blue-100 shadow-inner" : "hover:bg-blue-100/50"
                  }`}
                  onClick={async () => {
                    setUnreadCounts((prev) => ({
                      ...prev,
                      [user.email]: 0,
                    }));
                    setSelectedUser(user);
                    setShowChat(true);
                    await loadMessages(user);
                  }}
                >
                  {/* Notification badge positioned relative to the whole row */}
                  {unreadCount > 0 && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute animate-ping w-full h-full rounded-full bg-pink-400 opacity-40" />
                        <span className="relative z-10 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="relative mr-3">
                    <img
                      src={user.photo || defaultProfilePic}
                      alt={user.username}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-200"
                    />
                    {user.status && <VerifiedCheckmark />}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-blue-900 font-medium text-sm sm:text-base">
                        {user.firstName || user.username}
                      </p>
                    </div>

                    {onlineMap[user.email]?.online ? (
                      <p className="text-green-600 text-xs sm:text-sm">В сети</p>
                    ) : (
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Был(а) в сети {onlineMap[user.email]?.lastSeen || "недавно"}
                      </p>
                    )}
                  </div>
                </div>

              );
            })
        )}
      </div>

      {/* Main chat area */}
      {selectedUser && (
        <div
          className={`flex-1 flex flex-col ${!showChat ? "hidden md:flex" : "flex"}`}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-blue-100">
            <div className="flex items-center">
              {/* Back button on mobile */}
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden mr-3 text-blue-600 hover:text-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="relative mr-3">
                <img
                  src={selectedUser.photo || defaultProfilePic}
                  alt={selectedUser.username}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-blue-200"
                />
                {selectedUser.status && <VerifiedCheckmark />}
              </div>
              <div>
                <h3 className="text-blue-900 font-semibold text-sm sm:text-base">
                  {selectedUser.firstName || selectedUser.username}
                </h3>
                {onlineMap[selectedUser.email]?.online ? (
                  <p className="text-green-600 text-xs sm:text-sm">В сети</p>
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Был(а) в сети {onlineMap[selectedUser.email]?.lastSeen || "недавно"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages[selectedUser.email]
              ?.slice()
              .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
              .map((msg) => {
                const isMine = msg.senderEmail === currentUser?.email;
                return (
                  <div key={msg.id || msg.sentAt} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex flex-col whitespace-pre-wrap break-words p-3 max-w-[85%] sm:max-w-lg rounded-2xl ${
                        isMine
                          ? "bg-teal-600 text-white rounded-br-none"
                          : "bg-blue-100 text-blue-900 rounded-bl-none"
                      } shadow-md`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p
                        className={`text-xs mt-2 self-end ${
                          isMine ? "text-teal-100" : "text-blue-600"
                        }`}
                      >
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Input area */}
          <div className="pt-4 p-4 border-t-2 border-blue-100">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 w-full px-4 py-2 sm:py-3 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <span className="hidden sm:inline">Отправить</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}