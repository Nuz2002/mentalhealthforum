package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.CreatePostRequest;
import com.example.ForumBackend.dto.PostResponse;
import com.example.ForumBackend.model.Comment;
import com.example.ForumBackend.model.Post;
import com.example.ForumBackend.model.User;
import com.example.ForumBackend.repository.PostRepository;
import com.example.ForumBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentService commentService;

    @Autowired
    private ProfileService profileService;
    // We'll call a separate service to map comments

    /**
     * Create a new post from the given request, by a specific user.
     */
    public Post createPost(String userEmail, CreatePostRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        Post post = Post.builder()
                .user(user)
                .text(request.getText())
                .createdAt(LocalDateTime.now())
                .build();

        return postRepository.save(post);
    }

    /**
     * Return all posts with nested comments.
     * If you have a large DB, consider pagination or fetch-lazy approach.
     */
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll(); // or findAll(Sort.by(...)) or pagination
        return posts.stream()
                .map(this::mapToPostResponse)
                .toList();
    }

    /**
     * Convert Post entity to PostResponse with nested comments
     */
    private PostResponse mapToPostResponse(Post post) {
        List<Comment> comments = post.getComments();
        if (comments == null) {
            comments = List.of();
        }
        return PostResponse.builder()
                .id(post.getId())
                .text(post.getText())

                // REMOVE:
                // .username(post.getUser().getUsername())

                // ADD:
                .user(profileService.mapToDTO(post.getUser()))

                .comments(commentService.mapCommentsToResponse(comments))
                .build();

    }


    /**
     * Retrieve a single post (with comments) by ID.
     */
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return mapToPostResponse(post);
    }
}
