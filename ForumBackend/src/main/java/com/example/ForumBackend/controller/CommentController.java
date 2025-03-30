package com.example.ForumBackend.controller;

import com.example.ForumBackend.dto.CreateCommentRequest;
import com.example.ForumBackend.dto.PostResponse;
import com.example.ForumBackend.model.Comment;
import com.example.ForumBackend.service.CommentService;
import com.example.ForumBackend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private PostService postService;

    /**
     * Add a new comment or reply under the post
     * `parentCommentId` in the request determines if it's a top-level comment or a reply.
     */
    @PostMapping
    public ResponseEntity<PostResponse> createComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId,
            @RequestBody CreateCommentRequest request
    ) {
        Comment newComment = commentService.createComment(userDetails.getUsername(), postId, request);
        // Return the updated post with the new comment
        return ResponseEntity.ok(postService.getPostById(postId));
    }
}
