package com.example.ForumBackend.repository;

import com.example.ForumBackend.model.Conversation;
import com.example.ForumBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c WHERE (c.userA = :user1 AND c.userB = :user2) OR (c.userA = :user2 AND c.userB = :user1)")
    List<Conversation> findAllBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);


    List<Conversation> findAllByUserA_UsernameOrUserB_Username(String usernameA, String usernameB);
}
