package com.example.ForumBackend.dto;

import com.example.ForumBackend.model.VerificationStatus;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;

import java.time.LocalDateTime;

@Data
public class ProfileDTO {
    private String firstName;
    private String lastName;
    private String username;      // user can update if not verified or if you allow it
    private String email;         // read-only, won't be updated in ProfileService
    private String profession;


    //Not sure if the below works
    private boolean accountType;

    private String bio;
    private String photo;
    private VerificationStatus status;
    private int unreadCount;

    private LocalDateTime lastMessageAt;

}
