package com.university.application.service;

import com.university.web.dto.message.MessageCreateRequestDTO;
import com.university.web.dto.message.MessageResponseDTO;
import com.university.web.dto.conversation.ConversationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageService {
    // Mensajes
    MessageResponseDTO sendMessage(MessageCreateRequestDTO dto);
    MessageResponseDTO getMessageById(Long id);
    List<MessageResponseDTO> getConversationMessages(Long conversationId);
    void markAsRead(Long messageId);
    void deleteMessage(Long messageId);

    // Conversaciones
    ConversationResponseDTO getOrCreateConversation(Long userId1, Long userId2);
    List<ConversationResponseDTO> getUserConversations(Long userId);
    ConversationResponseDTO getConversationById(Long id);
    Integer getUnreadMessageCount(Long userId);

    // Búsquedas
    Page<MessageResponseDTO> searchMessages(Long userId, String keyword, Pageable pageable);
    List<MessageResponseDTO> getUnreadMessages(Long userId);
}