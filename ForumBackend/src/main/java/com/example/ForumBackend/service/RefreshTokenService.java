package com.example.ForumBackend.service;

import com.example.ForumBackend.model.RefreshToken;
import com.example.ForumBackend.model.User;
import com.example.ForumBackend.repository.RefreshTokenRepository;
import com.example.ForumBackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${jwt.refreshExpiration}")
    private Long refreshExpirationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Create a refresh token entity in the DB. This is called when the user logs in successfully.
     */
    public RefreshToken createRefreshToken(User user) {
        // Option: you can also delete all existing tokens for that user if you allow only 1 token per user:
        // refreshTokenRepository.deleteByUser(user);

        String tokenString = jwtUtil.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(tokenString)
                .expiryDate(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Finds the refresh token in DB, checks if it's valid and not revoked.
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Verify if refresh token is valid, not expired, and not revoked.
     */
    public void verifyRefreshToken(RefreshToken token) {
        if (token.isRevoked()) {
            throw new RuntimeException("Refresh token has been revoked");
        }
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token has expired");
        }
        // Also ensure the token string itself is valid
        if (!jwtUtil.validateRefreshToken(token.getToken())) {
            throw new RuntimeException("Invalid refresh token signature");
        }
    }

    /**
     * Revoke a refresh token (e.g. on logout).
     */
    public void revokeToken(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }

    /**
     * Revoke all tokens for a user (e.g. if user is compromised).
     */
    public long revokeAllUserTokens(User user) {
        var tokens = refreshTokenRepository.findAll();
        long count = 0;
        for (RefreshToken rt : tokens) {
            if (rt.getUser().equals(user) && !rt.isRevoked()) {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
                count++;
            }
        }
        return count;
    }
}
