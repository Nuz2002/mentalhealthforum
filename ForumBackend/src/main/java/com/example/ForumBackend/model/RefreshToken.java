package com.example.ForumBackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A user can have multiple refresh tokens (e.g., multiple devices),
    // or you could make this a OneToOne if you only want 1 active token per user.
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;  // The JWT or random string used as the refresh token

    private LocalDateTime expiryDate;

    private boolean revoked;  // If true, this token can no longer be used
}
