package com.example.ForumBackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who submitted the application
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Basic applicant info
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;

    // URLs or paths for the documents
    private String profilePhotoUrl;
    private String governmentIdUrl;
    private String qualificationsUrl;

    // A short professional bio
    @Column(length = 500)
    private String professionalBio;

    @Enumerated(EnumType.STRING)
    private VerificationStatus status;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
}
