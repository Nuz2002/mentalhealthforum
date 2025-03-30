package com.example.ForumBackend.controller;

import com.example.ForumBackend.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.*;

@Controller
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    @EventListener
    public void handleConnectEvent(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String email = accessor.getUser().getName();
        String sessionId = accessor.getSessionId();
        presenceService.markOnline(email, sessionId);
    }

    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (accessor.getUser() != null) {
            String email = accessor.getUser().getName();
            String sessionId = accessor.getSessionId();
            presenceService.markOffline(email, sessionId);
        }
    }

}
