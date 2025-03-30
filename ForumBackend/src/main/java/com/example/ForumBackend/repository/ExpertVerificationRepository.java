package com.example.ForumBackend.repository;

import com.example.ForumBackend.model.ExpertVerification;
import com.example.ForumBackend.model.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpertVerificationRepository extends JpaRepository<ExpertVerification, Long> {

    // Return all pending applications for the admin to see
    List<ExpertVerification> findAllByStatus(VerificationStatus status);
    Optional<ExpertVerification> findTopByUserEmailOrderBySubmittedAtDesc(String email);



}
