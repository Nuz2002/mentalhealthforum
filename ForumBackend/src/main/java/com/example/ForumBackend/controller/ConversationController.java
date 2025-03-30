package com.example.ForumBackend.controller;

import com.example.ForumBackend.dto.ConversationDTO;
import com.example.ForumBackend.dto.MessageDTO;
import com.example.ForumBackend.dto.ProfileDTO;
import com.example.ForumBackend.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    /**
     * Start or fetch a conversation with the target user.
     */
    @PostMapping("/start")
    public ResponseEntity<ConversationDTO> startConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String targetEmail
    ) {
        ConversationDTO dto = conversationService.startConversation(userDetails.getUsername(), targetEmail);
        return ResponseEntity.ok(dto);
    }

    /**
     * Get the conversation metadata (optionally with messages).
     */
    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationDTO> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId,
            @RequestParam(name = "includeMessages", defaultValue = "false") boolean includeMessages
    ) {
        ConversationDTO dto = conversationService.getConversationDTO(
                userDetails.getUsername(),
                conversationId,
                includeMessages
        );
        return ResponseEntity.ok(dto);
    }

    /**
     * Paginated messages in the conversation (for "load more" scenario).
     * page=0, size=20 => newest 20 messages.
     */
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<MessageDTO>> getMessagesPage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        List<MessageDTO> dtos = conversationService.getMessagesPage(conversationId, userDetails.getUsername(), page, size);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/my-users")
    public ResponseEntity<List<ProfileDTO>> getConversationUsers(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        System.out.println("Authenticated user: " + userDetails);

        List<ProfileDTO> profiles = conversationService.getConversationParticipantsWithProfiles(userDetails.getUsername());
        return ResponseEntity.ok(profiles);
    }

}
