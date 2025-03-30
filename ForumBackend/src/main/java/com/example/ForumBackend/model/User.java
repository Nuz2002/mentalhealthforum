package com.example.ForumBackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Indicates if the user completed email verification
    private boolean enabled;

    // Indicates if the user is "verified" in the sense of identity or admin approval
    private boolean verified;

    // Additional profile fields:
    private String firstName;
    private String lastName;
    private String profession;

    @Column(nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private boolean accountType = false; // false = private, true = public

    @Column(length = 1000)
    private String bio;
    private String photo;    // profileImageurl in other words


    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;

}
