package com.example.ForumBackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpertVerificationReviewDTO {
    private Long applicationId;
    private String username;      // from the user
    private String status;        // e.g. "APPROVED" or "REJECTED"
    private LocalDateTime reviewedAt;
}
