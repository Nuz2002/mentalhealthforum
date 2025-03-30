package com.example.ForumBackend.controller;

import com.example.ForumBackend.dto.CreatePostRequest;
import com.example.ForumBackend.dto.PostResponse;
import com.example.ForumBackend.model.Post;
import com.example.ForumBackend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    /**
     * Create a new post.
     */
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreatePostRequest request
    ) {
        // userDetails.getUsername() is email, as you set in your JWT
        Post post = postService.createPost(userDetails.getUsername(), request);
        // Return the newly created post as a PostResponse
        PostResponse response = postService.getPostById(post.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get all posts (with nested comments).
     */
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> allPosts = postService.getAllPosts();
        return ResponseEntity.ok(allPosts);
    }

    /**
     * Get a single post by ID (with comments).
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        PostResponse response = postService.getPostById(id);
        return ResponseEntity.ok(response);
    }
}
