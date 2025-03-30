package com.example.ForumBackend.service;

import com.example.ForumBackend.dto.ConversationDTO;
import com.example.ForumBackend.dto.MessageDTO;
import com.example.ForumBackend.dto.ProfileDTO;
import com.example.ForumBackend.mapper.ConversationMapper;
import com.example.ForumBackend.model.*;
import com.example.ForumBackend.repository.ConversationRepository;
import com.example.ForumBackend.repository.MessageRepository;
import com.example.ForumBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ProfileService profileService;

    /**
     * Start (or fetch existing) conversation with a target user,
     * blocking if target is private and no conversation exists.
     */
    public ConversationDTO startConversation(String currentUserEmail, String targetUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found: " + currentUserEmail));

        User targetUser = userRepository.findByEmail(targetUserEmail)
                .orElseThrow(() -> new RuntimeException("Target user not found: " + targetUserEmail));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("You cannot start a conversation with yourself.");
        }


        // Check if conversation already exists
        Optional<Conversation> existing = getConversation(currentUser, targetUser);
        if (existing.isPresent()) {
            // Return existing conversation as a DTO (no messages or up to you)
            return ConversationMapper.toDTO(existing.get(), false);
        }

        // If no existing conversation, check privacy
        if (!targetUser.isAccountType()) {
            throw new RuntimeException("Cannot start conversation: user is private and hasn't messaged you first.");
        }

        // Target is public -> create new conversation
        Conversation convo = Conversation.builder()
                .userA(currentUser)
                .userB(targetUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        convo = conversationRepository.save(convo);
        return ConversationMapper.toDTO(convo, false);
    }

    /**
     * Return a single conversation as a DTO (with or without embedded messages).
     */
    public ConversationDTO getConversationDTO(String currentUserEmail, Long conversationId, boolean includeMessages) {
        Conversation convo = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found with id: " + conversationId));

        // Check participant
        if (!isParticipant(convo, currentUserEmail)) {
            throw new RuntimeException("You are not a participant in this conversation.");
        }

        return ConversationMapper.toDTO(convo, includeMessages);
    }

    /**
     * Return the conversation entity for internal usage (e.g. sending messages).
     */
    public Conversation getConversationEntityOrThrow(Long conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
    }

    /**
     * Helper: find conversation by two users ignoring userA/userB order.
     */
    public Optional<Conversation> getConversation(User user1, User user2) {
        List<Conversation> results = conversationRepository.findAllBetweenUsers(user1, user2);
        if (results.isEmpty()) return Optional.empty();

        // Prefer the most recently updated one (optional logic)
        return Optional.of(results.stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .findFirst()
                .orElse(results.get(0)));
    }


    /**
     * Check if the given email is a participant of the conversation.
     */
    private boolean isParticipant(Conversation convo, String userEmail) {
        return convo.getUserA().getEmail().equals(userEmail)
                || convo.getUserB().getEmail().equals(userEmail);
    }

    /**
     * Retrieve a page of messages (sorted newest first) for a conversation,
     * then map them to MessageDTO.
     */
    public List<MessageDTO> getMessagesPage(Long conversationId, String currentUserEmail,
                                            int pageNumber, int pageSize) {

        // 1) Ensure conversation exists
        Conversation convo = getConversationEntityOrThrow(conversationId);

        // 2) Check participant
        if (!isParticipant(convo, currentUserEmail)) {
            throw new RuntimeException("You are not a participant in this conversation.");
        }

        // 3) Query newest messages first
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("sentAt").descending());
        Page<Message> messagePage = messageRepository.findByConversationOrderBySentAtDesc(convo, pageable);

        // 4) Convert to DTO
        return messagePage.stream()
                .map(ConversationMapper::mapMessageToDTO)
                .toList();
    }


    public List<ProfileDTO> getConversationParticipantsWithProfiles(String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentUsername = currentUser.getUsername();

        List<Conversation> conversations = conversationRepository.findAllByUserA_UsernameOrUserB_Username(currentUsername, currentUsername);

        Set<String> usernames = conversations.stream()
                .map(conv -> {
                    String usernameA = conv.getUserA().getUsername();
                    String usernameB = conv.getUserB().getUsername();
                    return usernameA.equals(currentUsername) ? usernameB : usernameA;
                })
                .collect(Collectors.toSet());

        return usernames.stream()
                .map(username -> {
                    ProfileDTO dto = profileService.getProfileDTOByUsername(username);
                    if (dto == null) return null;

                    // Get user entity to fetch email
                    User user = userRepository.findByUsername(username).orElse(null);
                    if (user == null) return null;

                    // Find conversation
                    Optional<Conversation> convoOpt = getConversation(currentUser, user);
                    if (convoOpt.isEmpty()) return dto;

                    Conversation conversation = convoOpt.get();

                    // ✅ Set unread count
                    long unreadCount = messageRepository.countByConversationAndRecipient_EmailAndIsReadFalse(conversation, currentUserEmail);
                    dto.setUnreadCount((int) unreadCount);

                    // ✅ Set lastMessageAt using conversation's updatedAt
                    dto.setLastMessageAt(conversation.getUpdatedAt());


                    return dto;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

    }


}
