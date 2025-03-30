package com.example.ForumBackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The post that this comment belongs to
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // The user who wrote the comment
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The text of the comment
    @Column(nullable = false)
    private String text;

    // For top-level comments, parent is null. For replies, parent is a top-level or another reply.
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Comment parent;

    // One-to-many self-reference for nested replies
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> replies = new ArrayList<>();

    private LocalDateTime createdAt;
}
