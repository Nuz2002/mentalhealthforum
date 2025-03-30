package com.example.ForumBackend.controller;

import com.example.ForumBackend.dto.ExpertVerificationRequest;
import com.example.ForumBackend.model.ExpertVerification;
import com.example.ForumBackend.service.ExpertVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/expert-verification")
public class ExpertVerificationController {

    @Autowired
    private ExpertVerificationService expertVerificationService;

    /**
     * Endpoint to submit the verification application.
     *
     * The front-end should send a multipart/form-data request
     * with fields: firstName, lastName, dateOfBirth, professionalBio
     * and files: profilePhoto, governmentId, qualifications
     *
     * e.g. form-data:
     *  key: firstName = "Jane"
     *  key: lastName = "Doe"
     *  key: dateOfBirth = "1990-01-01"
     *  key: professionalBio = "I have 10 years experience ..."
     *  key: profilePhoto (file)
     *  key: governmentId (file)
     *  key: qualifications (file)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ExpertVerification submitApplication(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("dateOfBirth") String dob,
            @RequestParam("professionalBio") String professionalBio,
            @RequestParam(name = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam(name = "governmentId", required = false) MultipartFile governmentId,
            @RequestParam(name = "qualifications", required = false) MultipartFile qualifications
    ) {
        // Build a request DTO
        ExpertVerificationRequest request = new ExpertVerificationRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setProfessionalBio(professionalBio);
        request.setDateOfBirth(java.time.LocalDate.parse(dob));
        request.setProfilePhoto(profilePhoto);
        request.setGovernmentId(governmentId);
        request.setQualifications(qualifications);

        return expertVerificationService.submitApplication(userDetails.getUsername(), request);
    }

    @GetMapping("/approved")
    public List<ExpertVerification> getApprovedExperts() {
        return expertVerificationService.getApprovedExperts();
    }

}
