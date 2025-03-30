package com.example.ForumBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean enabled;
    private boolean verified;
    private String firstName;
    private String lastName;
    private String profession;
    private boolean accountType;
    private String bio;
    private String photo;
    // No password field
}
