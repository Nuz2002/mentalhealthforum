package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.CommentResponse;
import com.example.ForumBackend.dto.CreateCommentRequest;
import com.example.ForumBackend.model.Comment;
import com.example.ForumBackend.model.Post;
import com.example.ForumBackend.model.User;
import com.example.ForumBackend.repository.CommentRepository;
import com.example.ForumBackend.repository.PostRepository;
import com.example.ForumBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileService profileService;

    /**
     * Create a new comment or reply under a post.
     */
    public Comment createComment(String userEmail, Long postId, CreateCommentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found with id: " + request.getParentCommentId()));
            // Optionally check if parent.getPost().getId() == postId for consistency
        }

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .text(request.getText())
                .parent(parent)
                .createdAt(LocalDateTime.now())
                .build();

        return commentRepository.save(comment);
    }

    /**
     * Maps a list of comments to a list of CommentResponse, including nested replies recursively.
     */
    public List<CommentResponse> mapCommentsToResponse(List<Comment> comments) {
        // Only map top-level comments here; for each comment's replies, do recursion
        return comments.stream()
                .filter(c -> c.getParent() == null) // top-level only
                .map(this::mapComment)
                .toList();
    }

    public CommentResponse mapComment(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .text(comment.getText())

                // ADD:
                .user(profileService.mapToDTO(comment.getUser()))

                .replyTo(comment.getParent() != null
                        ? profileService.mapToDTO(comment.getParent().getUser())
                        : null)

                .replies(Optional.ofNullable(comment.getReplies())
                        .orElse(Collections.emptyList())
                        .stream()
                        .map(this::mapComment)
                        .toList())
                .build();
    }

}
