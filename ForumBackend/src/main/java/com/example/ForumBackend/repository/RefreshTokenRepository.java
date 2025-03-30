package com.example.ForumBackend.repository;

import com.example.ForumBackend.model.RefreshToken;
import com.example.ForumBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    // If you want to remove all tokens for a user on logoutAll
    long deleteByUser(User user);
}
