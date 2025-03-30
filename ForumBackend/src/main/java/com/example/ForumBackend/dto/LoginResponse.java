package com.example.ForumBackend.dto;

import com.example.ForumBackend.model.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class LoginResponse {
    private String message;
    private String accessToken;
    private String refreshToken;
    private String role;
    private VerificationStatus status;

    public LoginResponse(String message, String accessToken, String refreshToken, String role, VerificationStatus status) {
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.status = status;
    }

    // getters and setters
}
