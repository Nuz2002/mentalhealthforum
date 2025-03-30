package com.example.ForumBackend.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
    private Long id;
    private String text;

    // Instead of just 'String username'
    private ProfileDTO user;

    private ProfileDTO replyTo;

    private List<CommentResponse> replies; // nested
}
