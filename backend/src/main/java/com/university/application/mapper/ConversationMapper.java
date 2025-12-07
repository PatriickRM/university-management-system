package com.university.application.mapper;

import com.university.domain.model.Conversation;
import com.university.web.dto.conversation.ConversationCreateRequestDTO;
import com.university.web.dto.conversation.ConversationResponseDTO;

public interface ConversationMapper {
    Conversation toEntity(ConversationCreateRequestDTO dto);
    ConversationResponseDTO toResponseDTO(Conversation conversation);
    ConversationResponseDTO toResponseDTO(Conversation conversation, Long currentUserId);
}