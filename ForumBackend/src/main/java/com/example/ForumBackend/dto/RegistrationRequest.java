package com.example.ForumBackend.dto;

import com.example.ForumBackend.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationRequest {

    @NotBlank
    @Size(min = 3, max = 30)
    private String username;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, max = 50)
    private String password;

    // Use a string if you like, and map to an enum. For this example, we just pass the enum name directly.
    private Role role;
}
