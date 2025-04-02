//package com.example.ForumBackend.service;
//
//import com.example.ForumBackend.dto.ExpertVerificationRequest;
//import com.example.ForumBackend.model.ExpertVerification;
//import com.example.ForumBackend.model.User;
//import com.example.ForumBackend.model.VerificationStatus;
//import com.example.ForumBackend.repository.ExpertVerificationRepository;
//import com.example.ForumBackend.repository.UserRepository;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.nio.file.Paths;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//public class ExpertVerificationService {
//
//    @Autowired
//    private ExpertVerificationRepository expertVerificationRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private FileStorageService fileStorageService;
//
//    /**
//     * Submits a new expert verification application.
//     */
//    public ExpertVerification submitApplication(String userEmail, ExpertVerificationRequest request) {
//        User user = userRepository.findByEmail(userEmail)
//                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
//
//        String profilePhotoUrl = uploadFile(request.getProfilePhoto());
//        String governmentIdUrl = uploadFile(request.getGovernmentId());
//        String qualificationsUrl = uploadFile(request.getQualifications());
//
//        ExpertVerification application = ExpertVerification.builder()
//                .user(user)
//                .firstName(request.getFirstName())
//                .lastName(request.getLastName())
//                .dateOfBirth(request.getDateOfBirth())
//                .professionalBio(request.getProfessionalBio())
//                .profilePhotoUrl(profilePhotoUrl)
//                .governmentIdUrl(governmentIdUrl)
//                .qualificationsUrl(qualificationsUrl)
//                .status(VerificationStatus.PENDING)
//                .submittedAt(LocalDateTime.now())
//                .build();
//
//        return expertVerificationRepository.save(application);
//    }
//
//    /**
//     * Returns all pending expert verification applications.
//     */
//    public List<ExpertVerification> getPendingApplications() {
//        return expertVerificationRepository.findAllByStatus(VerificationStatus.PENDING);
//    }
//
//
//    /**
//     * Retrieves a single application by its ID.
//     */
//    public ExpertVerification getApplication(Long id) {
//        return expertVerificationRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
//    }
//
//    /**
//     * Reviews (approves or rejects) an expert verification application.
//     * If approved, the associated user's 'verified' flag is set to true.
//     */
//    public ExpertVerification reviewApplication(Long applicationId, boolean approved) {
//        ExpertVerification application = getApplication(applicationId);
//        VerificationStatus newStatus = approved ? VerificationStatus.APPROVED : VerificationStatus.REJECTED;
//
//        application.setStatus(newStatus);
//        application.setReviewedAt(LocalDateTime.now());
//
//        User user = application.getUser();
//        user.setVerificationStatus(newStatus);
//
//
//        if (approved) {
//            user.setVerified(true);
//            userRepository.save(user);
//        }
//
//        return expertVerificationRepository.save(application);
//    }
//
//    private String uploadFile(MultipartFile file) {
//        if (file == null || file.isEmpty()) {
//            return null;
//        }
//        // Get the file path from your storage service
//        String filePath = fileStorageService.upload(file);
//
//        // Ensure the returned path starts with "/uploads/"
//        if (!filePath.startsWith("/uploads/")) {
//            // If the storage service returns only the filename or a relative path without '/uploads/'
//            filePath = "/uploads/" + filePath;
//        }
//        return filePath;
//    }
//
//    public VerificationStatus getLatestApplicationStatusByEmail(String email) {
//        return expertVerificationRepository.findTopByUserEmailOrderBySubmittedAtDesc(email)
//                .map(ExpertVerification::getStatus)
//                .orElse(null); // Return null if no application exists
//    }
//
//    public List<ExpertVerification> getApprovedExperts() {
//        return expertVerificationRepository.findAllByStatus(VerificationStatus.APPROVED);
//    }
//
//
//
//}


// Removed FileStorage
package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.ExpertVerificationRequest;
import com.example.ForumBackend.model.ExpertVerification;
import com.example.ForumBackend.model.User;
import com.example.ForumBackend.model.VerificationStatus;
import com.example.ForumBackend.repository.ExpertVerificationRepository;
import com.example.ForumBackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ExpertVerificationService {

    @Autowired
    private ExpertVerificationRepository expertVerificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Instead of local FileStorageService, use the S3Client
    @Autowired
    private S3Client s3Client;

    // Bucket name from application.properties
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    // If you're in eu-north-1, you can hardcode it here
    // or read it from "cloud.aws.region.static" if you prefer.
    private static final String AWS_REGION = "eu-north-1"; // adjust if needed

    /**
     * Submits a new expert verification application.
     */
    public ExpertVerification submitApplication(String userEmail, ExpertVerificationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        String profilePhotoUrl = uploadFile(request.getProfilePhoto());
        String governmentIdUrl = uploadFile(request.getGovernmentId());
        String qualificationsUrl = uploadFile(request.getQualifications());

        ExpertVerification application = ExpertVerification.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .professionalBio(request.getProfessionalBio())
                .profilePhotoUrl(profilePhotoUrl)
                .governmentIdUrl(governmentIdUrl)
                .qualificationsUrl(qualificationsUrl)
                .status(VerificationStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .build();

        return expertVerificationRepository.save(application);
    }

    /**
     * Returns all pending expert verification applications.
     */
    public List<ExpertVerification> getPendingApplications() {
        return expertVerificationRepository.findAllByStatus(VerificationStatus.PENDING);
    }

    /**
     * Retrieves a single application by its ID.
     */
    public ExpertVerification getApplication(Long id) {
        return expertVerificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
    }

    /**
     * Reviews (approves or rejects) an expert verification application.
     * If approved, the associated user's 'verified' flag is set to true.
     */
    public ExpertVerification reviewApplication(Long applicationId, boolean approved) {
        ExpertVerification application = getApplication(applicationId);
        VerificationStatus newStatus = approved ? VerificationStatus.APPROVED : VerificationStatus.REJECTED;

        application.setStatus(newStatus);
        application.setReviewedAt(LocalDateTime.now());

        User user = application.getUser();
        user.setVerificationStatus(newStatus);

        if (approved) {
            user.setVerified(true);
            userRepository.save(user);
        }

        return expertVerificationRepository.save(application);
    }

    /**
     * Uploads a file to S3 and returns the public (or direct) URL.
     */
    private String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID() + "_" + (originalFilename != null ? originalFilename : "upload");

        try {
            // 1) Upload to S3
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(uniqueFilename)
                            .acl("public-read") // if you want direct public access
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );

            // 2) Build the S3 URL (for eu-north-1)
            //    Format: https://<bucket>.s3.eu-north-1.amazonaws.com/<key>
            return "https://" + bucketName + ".s3." + AWS_REGION + ".amazonaws.com/" + uniqueFilename;

        } catch (IOException e) {
            // Handle exception
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    public VerificationStatus getLatestApplicationStatusByEmail(String email) {
        return expertVerificationRepository.findTopByUserEmailOrderBySubmittedAtDesc(email)
                .map(ExpertVerification::getStatus)
                .orElse(null); // Return null if no application exists
    }

    public List<ExpertVerification> getApprovedExperts() {
        return expertVerificationRepository.findAllByStatus(VerificationStatus.APPROVED);
    }
}
