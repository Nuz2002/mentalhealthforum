package com.example.ForumBackend.repository;

import com.example.ForumBackend.model.Message;
import com.example.ForumBackend.model.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // Return messages for a specific conversation, sorted by sentAt descending
    Page<Message> findByConversationOrderBySentAtDesc(Conversation conversation, Pageable pageable);

    long countByRecipient_EmailAndIsReadFalse(String recipientEmail);
    long countByConversationAndRecipient_EmailAndIsReadFalse(Conversation conversation, String recipientEmail);
    List<Message> findByConversationAndRecipient_EmailAndIsReadFalse(Conversation conversation, String recipientEmail);



}
