package com.example.ForumBackend.security;

import com.example.ForumBackend.model.User;
import com.example.ForumBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.messaging.simp.stomp.StompCommand;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authHeader = accessor.getNativeHeader("Authorization");
            System.out.println("💬 STOMP connect with header: " + authHeader);

            if (authHeader != null && !authHeader.isEmpty()) {
                String token = authHeader.get(0).replace("Bearer ", "");
                String email = jwtUtil.getEmailFromAccessToken(token);

                // 🧪 Debug logs to trace issues
                System.out.println("STOMP HEADERS: " + authHeader + " => " + token);
                System.out.println("Extracted email: " + email);

                User user = userRepository.findByEmail(email).orElse(null);
                System.out.println("User found in DB: " + (user != null ? user.getEmail() : "none"));

                if (user != null && jwtUtil.validateAccessToken(token)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user.getEmail(), null, List.of()
                    );
                    accessor.setUser(authentication);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        return message;
    }
}
