package com.example.ForumBackend.controller;

import com.example.ForumBackend.dto.ProfileDTO;
import com.example.ForumBackend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /**
     * Get the current user's profile info using email (from the JWT token).
     */
    @GetMapping
    public ResponseEntity<ProfileDTO> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // userDetails.getUsername() now returns the email address
        ProfileDTO profile = profileService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }


    /**
     * Update the current user's profile info using email.
     */
    @PutMapping
    public ResponseEntity<ProfileDTO> updateUserProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileDTO profileDTO
    ) {
        ProfileDTO updatedProfile = profileService.updateProfileByEmail(userDetails.getUsername(), profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Upload or change profile picture.
     * In the front-end, you would POST with form-data containing the file:
     * key: "file", value: <selected image file>
     */
    @PostMapping("/picture")
    public ResponseEntity<String> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String imageUrl = profileService.updateProfilePictureByEmail(userDetails.getUsername(), file);
        return ResponseEntity.ok("Фотография профиля обновлена. URL: " + imageUrl);

    }

    /**
     * Delete the profile picture.
     */
    @DeleteMapping("/picture")
    public ResponseEntity<String> deleteProfilePicture(@AuthenticationPrincipal UserDetails userDetails) {
        profileService.deleteProfilePictureByEmail(userDetails.getUsername());
        return ResponseEntity.ok("Фотография профиля удалена.");
    }

    /**
     * Get public profile info by username (e.g., from a post).
     */
    @GetMapping("/{username}")
    public ResponseEntity<ProfileDTO> getPublicProfile(@PathVariable String username) {
        ProfileDTO profile = profileService.getProfileByUsername(username);

        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        // Optionally, check if the profile is public
        if (!profile.isAccountType()) { // assuming accountType=true means public
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(profile);
    }

}
