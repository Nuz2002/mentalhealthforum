package com.example.ForumBackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who authored the post
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // referencing your existing User entity

    @Column(nullable = false)
    private String text;

    private LocalDateTime createdAt;

    // If you want to fetch comments eagerly:
    // But typically you'd fetch them lazily and use a separate query
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    // You can store additional fields: title, images, likeCount, etc.
}
