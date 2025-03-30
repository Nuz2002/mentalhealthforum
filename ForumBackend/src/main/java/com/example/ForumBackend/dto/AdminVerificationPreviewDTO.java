package com.example.ForumBackend.dto;

import lombok.*;

import java.util.List;

/**
 * Minimal application info for the admin panel.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminVerificationPreviewDTO {

    private Long applicationId;
    private String username;
    private String firstName;
    private String lastName;
    private String photo;
    private String professionalBio;
    private List<String> documents; // e.g. [governmentIdUrl, qualificationsUrl, etc.]
}
