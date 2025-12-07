package com.university.application.mapper.impl;

import com.university.application.mapper.ConversationMapper;
import com.university.domain.model.Conversation;
import com.university.domain.model.enums.MessageStatus;
import com.university.web.dto.conversation.ConversationCreateRequestDTO;
import com.university.web.dto.conversation.ConversationResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ConversationMapperImpl implements ConversationMapper {

    @Override
    public Conversation toEntity(ConversationCreateRequestDTO dto) {
        return Conversation.builder()
                .build();
    }

    @Override
    public ConversationResponseDTO toResponseDTO(Conversation conversation) {
        if (conversation == null) return null;

        // Obtener último mensaje
        String lastMessageContent = null;
        if (conversation.getMessages() != null && !conversation.getMessages().isEmpty()) {
            lastMessageContent = conversation.getMessages()
                    .get(conversation.getMessages().size() - 1)
                    .getContent();
        }

        return ConversationResponseDTO.builder()
                .id(conversation.getId())
                .participant1Id(conversation.getParticipant1().getId())
                .participant1Name(conversation.getParticipant1().getFirstName() + " " +
                        conversation.getParticipant1().getLastName())
                .participant1Email(conversation.getParticipant1().getEmail())
                .participant2Id(conversation.getParticipant2().getId())
                .participant2Name(conversation.getParticipant2().getFirstName() + " " +
                        conversation.getParticipant2().getLastName())
                .participant2Email(conversation.getParticipant2().getEmail())
                .createdAt(conversation.getCreatedAt())
                .lastMessageAt(conversation.getLastMessageAt())
                .lastMessageContent(lastMessageContent)
                .build();
    }

    @Override
    public ConversationResponseDTO toResponseDTO(Conversation conversation, Long currentUserId) {
        if (conversation == null) return null;

        ConversationResponseDTO dto = toResponseDTO(conversation);

        // Calcular mensajes no leídos para el usuario actual
        if (conversation.getMessages() != null) {
            int unreadCount = (int) conversation.getMessages().stream()
                    .filter(m -> m.getReceiver().getId().equals(currentUserId))
                    .filter(m -> m.getStatus() != MessageStatus.LEIDO)
                    .count();
            dto.setUnreadCount(unreadCount);
        }

        return dto;
    }
}
