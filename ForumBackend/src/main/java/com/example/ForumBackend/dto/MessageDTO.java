package com.example.ForumBackend.dto;

import com.example.ForumBackend.model.User;
import com.example.ForumBackend.model.VerificationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Minimal fields for a single message.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private String senderEmail;
    private String text;
    private LocalDateTime sentAt;
    private String clientId;

    @Column(nullable = false)
    private boolean isRead = false;

    // And optionally:
    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

}
