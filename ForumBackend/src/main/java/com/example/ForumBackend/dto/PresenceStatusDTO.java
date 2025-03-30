// dto/PresenceStatusDTO.java
package com.example.ForumBackend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PresenceStatusDTO {
    private String email;
    private boolean online;
    private String lastSeen; // e.g., "2 minutes ago" or null if online
}
