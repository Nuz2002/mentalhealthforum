package com.example.ForumBackend.controller;

import com.example.ForumBackend.dto.AdminVerificationPreviewDTO;
import com.example.ForumBackend.dto.ExpertVerificationReviewDTO;
import com.example.ForumBackend.model.ExpertVerification;
import com.example.ForumBackend.service.ExpertVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/admin/expert-verifications")
public class AdminExpertVerificationController {

    @Autowired
    private ExpertVerificationService expertVerificationService;

    /**
     * Retrieve all pending applications.
     * Example: GET /api/admin/expert-verifications/pending
     */
    @GetMapping("/pending")
    // @PreAuthorize("hasRole('ADMIN')") // if you have role-based checks
    public ResponseEntity<List<AdminVerificationPreviewDTO>> getPendingApplications() {
        List<ExpertVerification> pendingList = expertVerificationService.getPendingApplications();

        // In the GET /pending endpoint mapping
        List<AdminVerificationPreviewDTO> dtos = pendingList.stream().map(app -> {
            return AdminVerificationPreviewDTO.builder()
                    .applicationId(app.getId())
                    .username(app.getUser().getUsername())
                    .firstName(app.getFirstName())
                    .lastName(app.getLastName())
                    .photo(toPublicUrl(app.getProfilePhotoUrl()))
                    .professionalBio(app.getProfessionalBio())
                    .documents(
                            // Filter out null URLs
                            Stream.of(app.getGovernmentIdUrl(), app.getQualificationsUrl())
                                    .filter(Objects::nonNull)
                                    .collect(Collectors.toList())
                    )
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * Retrieve the details of a single application by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminVerificationPreviewDTO> getApplicationDetails(@PathVariable Long id) {
        ExpertVerification app = expertVerificationService.getApplication(id);

        AdminVerificationPreviewDTO dto = AdminVerificationPreviewDTO.builder()
                .applicationId(app.getId())
                .username(app.getUser().getUsername())
                .firstName(app.getFirstName())
                .lastName(app.getLastName())
                .photo(app.getProfilePhotoUrl())
                .professionalBio(app.getProfessionalBio())
                .documents(List.of(
                        app.getGovernmentIdUrl(),
                        app.getQualificationsUrl()
                ))
                .build();

        return ResponseEntity.ok(dto);
    }


    /**
     * Approve or reject an application
     * Example: POST /api/admin/expert-verifications/123/review?approved=true
     */
    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExpertVerificationReviewDTO> reviewApplication(
            @PathVariable("id") Long id,
            @RequestParam("approved") boolean approved
    ) {
        ExpertVerification updated = expertVerificationService.reviewApplication(id, approved);

        // Build a minimal DTO
        ExpertVerificationReviewDTO dto = ExpertVerificationReviewDTO.builder()
                .applicationId(updated.getId())
                .username(updated.getUser().getUsername())
                .status(updated.getStatus().toString())       // "APPROVED" or "REJECTED"
                .reviewedAt(updated.getReviewedAt())
                .build();

        return ResponseEntity.ok(dto);
    }

    private String toPublicUrl(String fullPath) {
        if (fullPath == null) return null;
        return "/uploads/" + Paths.get(fullPath).getFileName().toString();
    }

}
