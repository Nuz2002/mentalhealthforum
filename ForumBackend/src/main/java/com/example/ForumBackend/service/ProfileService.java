//package com.example.ForumBackend.service;
//
//import com.example.ForumBackend.dto.ProfileDTO;
//import com.example.ForumBackend.model.ExpertVerification;
//import com.example.ForumBackend.model.User;
//import com.example.ForumBackend.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//public class ProfileService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Value("${file.upload-dir}")
//    private String uploadDir;
//
//    @Value("${file.server-url}")
//    private String serverUrl;
//
//    /**
//     * Retrieves the current user's profile using email.
//     */
//    public ProfileDTO getProfileByEmail(String email) {
//        User user = findUserOrThrowByEmail(email);
//        return mapToDTO(user);
//    }
//
//
//    /**
//     * Updates the current user's profile using email.
//     * Requirements:
//     * - Email is immutable and is not updated.
//     * - If the user is not verified, firstName and lastName are updated.
//     *   If verified, these fields remain unchanged.
//     * - Other fields (username, profession, accountPrivacy, bio) are updated.
//     */
//    public ProfileDTO updateProfileByEmail(String email, ProfileDTO profileDTO) {
//        User user = findUserOrThrowByEmail(email);
//
//        // Update firstName and lastName only if the user is not verified
//        if (!user.isVerified()) {
//            if (profileDTO.getFirstName() != null) {
//                user.setFirstName(profileDTO.getFirstName());
//            }
//            if (profileDTO.getLastName() != null) {
//                user.setLastName(profileDTO.getLastName());
//            }
//        }
//
//        // Never update email even if provided in payload
//
//        // Update other fields:
//        if (profileDTO.getUsername() != null) {
//            user.setUsername(profileDTO.getUsername());
//        }
//        if (profileDTO.getProfession() != null) {
//            user.setProfession(profileDTO.getProfession());
//        }
//        user.setAccountType(profileDTO.isAccountType());
//        System.out.println(user.isAccountType());
//        if (profileDTO.getBio() != null) {
//            user.setBio(profileDTO.getBio());
//        }
//
//        userRepository.save(user);
//        return mapToDTO(user);
//    }
//
//    /**
//     * Updates the user's profile picture using email.
//     */
//    public String updateProfilePictureByEmail(String email, MultipartFile file) throws IOException {
//        User user = findUserOrThrowByEmail(email);
//
//        // Create upload directory if it doesn't exist
//        Path uploadPath = Paths.get(uploadDir);
//        if (!Files.exists(uploadPath)) {
//            Files.createDirectories(uploadPath);
//        }
//
//        // Generate unique filename
//        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
//        Path filePath = uploadPath.resolve(filename);
//
//        // Save file
//        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//        // Set URL
//        String generatedUrl = serverUrl + filename;
//        user.setPhoto(generatedUrl);
//        userRepository.save(user);
//
//        return generatedUrl;
//    }
//
//    /**
//     * Deletes the user's profile picture using email.
//     */
//    public void deleteProfilePictureByEmail(String email) {
//        User user = findUserOrThrowByEmail(email);
//        user.setPhoto(null);
//        userRepository.save(user);
//    }
//
//    /**
//     * Helper method to fetch the user by email or throw an exception if not found.
//     */
//    private User findUserOrThrowByEmail(String email) {
//        Optional<User> optional = userRepository.findByEmail(email);
//        if (optional.isEmpty()) {
//            throw new RuntimeException("User not found with email: " + email);
//        }
//        return optional.get();
//    }
//
//    /**
//     * Maps the User entity to a ProfileDTO for sending to the client.
//     */
//    public ProfileDTO mapToDTO(User user) {
//        ProfileDTO dto = new ProfileDTO();
//        dto.setFirstName(user.getFirstName());
//        dto.setLastName(user.getLastName());
//        dto.setUsername(user.getUsername());
//        dto.setEmail(user.getEmail()); // Read-only display of email
//        dto.setProfession(user.getProfession());
//        dto.setAccountType(user.isAccountType());
//        dto.setBio(user.getBio());
//        dto.setStatus(user.getVerificationStatus());
//        dto.setPhoto(user.getPhoto());
//
//        return dto;
//    }
//
//
//    // In ProfileService.java
//    /**
//     * Retrieves a public user profile by username.
//     */
//    public ProfileDTO getProfileByUsername(String username) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
//
//        return mapToDTO(user);
//    }
//
//    public ProfileDTO getProfileDTOByUsername(String username) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        return convertToDTO(user);
//    }
//
//    private ProfileDTO convertToDTO(User user) {
//        ProfileDTO dto = new ProfileDTO();
//        dto.setUsername(user.getUsername());
//        dto.setFirstName(user.getFirstName());
//        dto.setLastName(user.getLastName());
//        dto.setEmail(user.getEmail());
//        dto.setProfession(user.getProfession());
//        dto.setBio(user.getBio());
//        dto.setPhoto(user.getPhoto());
//        dto.setStatus(user.getVerificationStatus());
//        dto.setAccountType(user.isAccountType());
//
//        return dto;
//    }
//
//
//
//
//}

// FOR AMAZON UPLOAD SERVICE

package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.ProfileDTO;
import com.example.ForumBackend.model.User;
import com.example.ForumBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    // Inject the S3 client
    @Autowired
    private S3Client s3Client;

    // Read the bucket name from application.properties
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    /**
     * Retrieves the current user's profile using email.
     */
    public ProfileDTO getProfileByEmail(String email) {
        User user = findUserOrThrowByEmail(email);
        return mapToDTO(user);
    }

    /**
     * Updates the current user's profile using email.
     * Requirements:
     * - Email is immutable and is not updated.
     * - If the user is not verified, firstName and lastName are updated.
     *   If verified, these fields remain unchanged.
     * - Other fields (username, profession, accountPrivacy, bio) are updated.
     */
    public ProfileDTO updateProfileByEmail(String email, ProfileDTO profileDTO) {
        User user = findUserOrThrowByEmail(email);

        // Update firstName and lastName only if the user is not verified
        if (!user.isVerified()) {
            if (profileDTO.getFirstName() != null) {
                user.setFirstName(profileDTO.getFirstName());
            }
            if (profileDTO.getLastName() != null) {
                user.setLastName(profileDTO.getLastName());
            }
        }

        // Never update email even if provided in payload

        // Update other fields:
        if (profileDTO.getUsername() != null) {
            user.setUsername(profileDTO.getUsername());
        }
        if (profileDTO.getProfession() != null) {
            user.setProfession(profileDTO.getProfession());
        }
        user.setAccountType(profileDTO.isAccountType());
        if (profileDTO.getBio() != null) {
            user.setBio(profileDTO.getBio());
        }

        userRepository.save(user);
        return mapToDTO(user);
    }

    /**
     * Updates the user's profile picture using email (uploads to S3).
     */
    public String updateProfilePictureByEmail(String email, MultipartFile file) throws IOException {
        User user = findUserOrThrowByEmail(email);

        // 1) Generate a unique filename
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID() + "_" + (originalFilename != null ? originalFilename : "upload");

        // 2) Upload to S3 with public-read ACL (optional if you need a publicly accessible URL)
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(uniqueFilename)
                        .acl("public-read") // remove if you don't want files to be publicly accessible
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // 3) Build the S3 file URL (depends on region/bucket)
        //    For eu-north-1, the standard pattern is:
        //    "https://<bucket-name>.s3.<region>.amazonaws.com/<key>"
        String s3Url = "https://" + bucketName + ".s3.eu-north-1.amazonaws.com/" + uniqueFilename;

        // 4) Save the S3 URL to the user record
        user.setPhoto(s3Url);
        userRepository.save(user);

        return s3Url;
    }

    /**
     * Deletes the user's profile picture using email.
     * (Optionally: you'd also delete from S3 if you want the file removed from the bucket).
     */
    public void deleteProfilePictureByEmail(String email) {
        User user = findUserOrThrowByEmail(email);

        // If you want to remove the file from S3, call s3Client.deleteObject here
        // e.g. parse the "key" from user.getPhoto() if it follows a known pattern.

        user.setPhoto(null);
        userRepository.save(user);
    }

    /**
     * Helper method to fetch the user by email or throw an exception if not found.
     */
    private User findUserOrThrowByEmail(String email) {
        Optional<User> optional = userRepository.findByEmail(email);
        if (optional.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return optional.get();
    }

    /**
     * Maps the User entity to a ProfileDTO for sending to the client.
     */
    public ProfileDTO mapToDTO(User user) {
        ProfileDTO dto = new ProfileDTO();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail()); // Read-only display of email
        dto.setProfession(user.getProfession());
        dto.setAccountType(user.isAccountType());
        dto.setBio(user.getBio());
        dto.setStatus(user.getVerificationStatus());
        dto.setPhoto(user.getPhoto());

        return dto;
    }

    /**
     * Retrieves a public user profile by username.
     */
    public ProfileDTO getProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return mapToDTO(user);
    }

    public ProfileDTO getProfileDTOByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return convertToDTO(user);
    }

    private ProfileDTO convertToDTO(User user) {
        ProfileDTO dto = new ProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setProfession(user.getProfession());
        dto.setBio(user.getBio());
        dto.setPhoto(user.getPhoto());
        dto.setStatus(user.getVerificationStatus());
        dto.setAccountType(user.isAccountType());
        return dto;
    }
}
