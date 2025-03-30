//package com.example.ForumBackend.service;
//
//import com.example.ForumBackend.dto.PresenceStatusDTO;
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.Instant;
//import java.util.*;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Service
//@RequiredArgsConstructor
//public class PresenceService {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    // Tracks email → active session IDs
//    private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();
//
//    // Tracks last seen timestamps
//    private final Map<String, Instant> lastSeenMap = new ConcurrentHashMap<>();
//
//    public void markOnline(String email, String sessionId) {
//        userSessions.computeIfAbsent(email, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
//        System.out.println("✅ " + email + " connected [" + sessionId + "] → Sessions: " + userSessions.get(email));
//        broadcastStatus(email, true);
//    }
//
//    public void markOffline(String email, String sessionId) {
//        Set<String> sessions = userSessions.get(email);
//        if (sessions != null) {
//            sessions.remove(sessionId);
//            System.out.println("❌ " + email + " disconnected [" + sessionId + "]");
//
//            if (sessions.isEmpty()) {
//                userSessions.remove(email);
//                lastSeenMap.put(email, Instant.now());
//                broadcastStatus(email, false);
//            }
//        }
//    }
//
//    public boolean isOnline(String email) {
//        return userSessions.containsKey(email) && !userSessions.get(email).isEmpty();
//    }
//
//    public Set<String> getAllOnline() {
//        return Collections.unmodifiableSet(userSessions.keySet());
//    }
//
//    public String getLastSeen(String email) {
//        Instant last = lastSeenMap.get(email);
//        if (last == null) return null;
//
//        long minutesAgo = (Instant.now().getEpochSecond() - last.getEpochSecond()) / 60;
//        if (minutesAgo < 1) return "just now";
//        if (minutesAgo == 1) return "a minute ago";
//        if (minutesAgo < 60) return minutesAgo + " minutes ago";
//
//        return "a while ago";
//    }
//
//    private void broadcastStatus(String email, boolean online) {
//        String lastSeen = online ? null : getLastSeen(email);
//        PresenceStatusDTO statusDTO = new PresenceStatusDTO(email, online, lastSeen);
//        messagingTemplate.convertAndSend("/topic/presence", statusDTO);
//    }
//}


package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.PresenceStatusDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service that manages real-time presence (online/offline).
 *
 * Logs and Explanations:
 * -----------------------
 * 1) "✅ <email> connected [sessionId]" -> User is connecting with new session
 *    - We add <sessionId> to the map.
 * 2) "❌ <email> disconnected [sessionId]" -> A single session ended
 *    - If that was the last session, user goes offline.
 * 3) ">>> Current sessions for <email>: ..." -> Tells you the set of session IDs for that user after updates.
 * 4) ">>> Entire userSessions map: ..." -> The global map of all email -> session sets.
 * 5) "broadcastStatus(...) to /topic/presence" -> The final step that sends a PresenceStatusDTO to the front-end.
 */
@Service
@RequiredArgsConstructor
public class PresenceService {

    private final SimpMessagingTemplate messagingTemplate;

    // Maps email → active WebSocket session IDs
    private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();

    // Tracks last seen timestamps
    private final Map<String, Instant> lastSeenMap = new ConcurrentHashMap<>();

    /**
     * Mark a user online with a specific sessionId.
     * If the user was offline, they become online once this set is non-empty.
     */
    public void markOnline(String email, String sessionId) {
        // Add sessionId to the user
        userSessions
                .computeIfAbsent(email, k -> ConcurrentHashMap.newKeySet())
                .add(sessionId);

        // Remove any "lastSeen" entry, because user is now online
        lastSeenMap.remove(email);

        System.out.println("✅ " + email + " connected [" + sessionId + "]");
        System.out.println(">>> Current sessions for " + email + ": " + userSessions.get(email));
        System.out.println(">>> Entire userSessions map: " + userSessions);

        // Broadcast that this user is online
        broadcastStatus(email, true);
    }

    /**
     * Mark a user offline for a specific sessionId.
     * If they have other sessions open, they remain online.
     * Only if the last session is removed, we record lastSeen and broadcast offline.
     */
    public void markOffline(String email, String sessionId) {
        // If user has an active session set, remove the one that disconnected
        Set<String> sessions = userSessions.get(email);
        if (sessions != null) {
            sessions.remove(sessionId);

            System.out.println("❌ " + email + " disconnected [" + sessionId + "]");
            System.out.println(">>> Current sessions for " + email + ": " + sessions);

            // If no sessions remain, the user is fully offline
            if (sessions.isEmpty()) {
                userSessions.remove(email);
                lastSeenMap.put(email, Instant.now());
                broadcastStatus(email, false);

                System.out.println(">>> " + email + " is now fully offline.");
            }
        }

        System.out.println(">>> Entire userSessions map: " + userSessions);
    }

    /**
     * Returns true if the user has at least one active session.
     */
    public boolean isOnline(String email) {
        return userSessions.containsKey(email) && !userSessions.get(email).isEmpty();
    }

    /**
     * Returns the current set of all users who have any active session.
     */
    public Set<String> getAllOnline() {
        return userSessions.keySet();
    }

    /**
     * Calculates "lastSeen" like "just now", "5 minutes ago", or "a while ago".
     */
    public String getLastSeen(String email) {
        Instant last = lastSeenMap.get(email);
        if (last == null) return null;

        long minutesAgo = (Instant.now().getEpochSecond() - last.getEpochSecond()) / 60;
        if (minutesAgo < 1) return "только что";
        if (minutesAgo == 1) return "минуту назад";
        if (minutesAgo < 60) return minutesAgo + " мин. назад";

        return "давно";
    }


    /**
     * Sends a presence update to /topic/presence, so all subscribers see
     * { email, online: true/false, lastSeen: String? }.
     */
    private void broadcastStatus(String email, boolean online) {
        String lastSeen = online ? null : getLastSeen(email);

        PresenceStatusDTO statusDTO = new PresenceStatusDTO(email, online, lastSeen);

        // This is where the message is actually sent to the front-end
        System.out.println(">>> broadcastStatus(...) to /topic/presence : " + statusDTO);
        messagingTemplate.convertAndSend("/topic/presence", statusDTO);
    }
}
