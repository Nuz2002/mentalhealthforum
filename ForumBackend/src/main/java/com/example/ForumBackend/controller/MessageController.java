package com.example.ForumBackend.controller;

import com.example.ForumBackend.dto.MessageDTO;
import com.example.ForumBackend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    /**
     * Send a message to an existing conversation.
     */
    @PostMapping("/{conversationId}/send")
    public ResponseEntity<MessageDTO> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId,
            @RequestBody String text
    ) {
        MessageDTO dto = messageService.sendMessage(userDetails.getUsername(), conversationId, text);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{conversationId}/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId
    ) {
        // If your userDetails actually returns the email:
        String email = userDetails.getUsername();

        messageService.markMessagesAsRead(conversationId, email);

        return ResponseEntity.ok().build();
    }


}
