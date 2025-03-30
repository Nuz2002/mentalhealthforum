package com.example.ForumBackend.repository;

import com.example.ForumBackend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
