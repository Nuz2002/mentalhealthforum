package com.example.ForumBackend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class ExpertVerificationRequest {

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String professionalBio;

    // If you want to handle file uploads in the same DTO, include these:
    private MultipartFile profilePhoto;
    private MultipartFile governmentId;
    private MultipartFile qualifications;
}
