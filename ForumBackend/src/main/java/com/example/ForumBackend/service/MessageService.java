package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.MessageDTO;
import com.example.ForumBackend.mapper.ConversationMapper;
import com.example.ForumBackend.model.Conversation;
import com.example.ForumBackend.model.Message;
import com.example.ForumBackend.model.User;
import com.example.ForumBackend.repository.MessageRepository;
import com.example.ForumBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationService conversationService;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // Add the SimpMessagingTemplate for broadcasting messages
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send a new message in an existing conversation.
     * Also broadcasts the new message to /topic/messages/{conversationId} via WebSocket.
     */
    public MessageDTO sendMessage(String senderEmail, Long conversationId, String text) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + senderEmail));

        Conversation convo = conversationService.getConversationEntityOrThrow(conversationId);

        // Ensure the sender is a participant in this conversation
        if (!(sender.getId().equals(convo.getUserA().getId())
                || sender.getId().equals(convo.getUserB().getId()))) {
            throw new RuntimeException("You are not a participant in this conversation.");
        }

        // Determine the recipient (the other user in the conversation)
        User recipient = sender.getId().equals(convo.getUserA().getId())
                ? convo.getUserB()
                : convo.getUserA();

        // Create & save the message with recipient + unread flag
        Message msg = Message.builder()
                .conversation(convo)
                .sender(sender)
                .recipient(recipient)
                .text(text)
                .isRead(false)
                .sentAt(LocalDateTime.now())
                .build();

        msg = messageRepository.save(msg);

        // Optionally update the conversation's "updatedAt" if you want
        convo.setUpdatedAt(LocalDateTime.now());
        // conversationRepository.save(convo); // if you want to persist that change

        // Convert to DTO for returning & broadcasting
        MessageDTO dto = ConversationMapper.mapMessageToDTO(msg);

        // Broadcast this new message to anyone subscribed to /topic/messages/{conversationId}
        messagingTemplate.convertAndSend("/topic/messages/" + conversationId, dto);

        return dto;
    }

    @Transactional
    public void markMessagesAsRead(Long conversationId, String recipientEmail) {
        Conversation convo = conversationService.getConversationEntityOrThrow(conversationId);
        List<Message> unreadMessages = messageRepository
                .findByConversationAndRecipient_EmailAndIsReadFalse(convo, recipientEmail);

        unreadMessages.forEach(msg -> msg.setRead(true));
        messageRepository.saveAll(unreadMessages);
    }

}
