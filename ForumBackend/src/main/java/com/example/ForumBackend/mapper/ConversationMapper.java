package com.example.ForumBackend.mapper;

import com.example.ForumBackend.dto.ConversationDTO;
import com.example.ForumBackend.dto.MessageDTO;
import com.example.ForumBackend.model.Conversation;
import com.example.ForumBackend.model.Message;
import java.util.List;

public class ConversationMapper {

    public static ConversationDTO toDTO(Conversation conversation, boolean includeMessages) {
        // gather participant usernames
        List<String> participants = List.of(
                conversation.getUserA().getUsername(),
                conversation.getUserB().getUsername()
        );

        ConversationDTO.ConversationDTOBuilder builder = ConversationDTO.builder()
                .id(conversation.getId())
                .participants(participants)
                .updatedAt(conversation.getUpdatedAt());

        if (includeMessages) {
            // convert each message to MessageDTO
            List<MessageDTO> messageDTOs = conversation.getMessages().stream()
                    .map(ConversationMapper::mapMessageToDTO)
                    .toList();
            builder.messages(messageDTOs);
        }

        return builder.build();
    }

    public static MessageDTO mapMessageToDTO(Message msg) {
        return MessageDTO.builder()
                .id(msg.getId())
                .senderEmail(msg.getSender().getEmail())
                .text(msg.getText())
                .sentAt(msg.getSentAt())
                .build();
    }
}
