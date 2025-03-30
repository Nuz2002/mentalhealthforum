package com.example.ForumBackend.dto;

import lombok.Data;

@Data
public class RefreshTokenResponse {
    private String accessToken;
    // maybe add expiry or other fields if desired

    public RefreshTokenResponse(String accessToken) {
        this.accessToken = accessToken;
    }
    // getter
}
