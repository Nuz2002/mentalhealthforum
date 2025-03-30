package com.example.ForumBackend.dto;

import com.example.ForumBackend.model.VerificationStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Minimal fields for representing a conversation.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConversationDTO {
    private Long id;
    private List<String> participants;  // e.g. [ "userA", "userB" ]
    private LocalDateTime updatedAt;
    private List<MessageDTO> messages;
}
