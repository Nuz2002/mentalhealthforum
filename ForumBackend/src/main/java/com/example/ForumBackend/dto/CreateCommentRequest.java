package com.example.ForumBackend.dto;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private String text;
    private Long parentCommentId;
    // If null, top-level comment. If set, indicates a reply to an existing comment
}
