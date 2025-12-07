package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.ConversationMapper;
import com.university.application.mapper.MessageMapper;
import com.university.application.service.MessageService;
import com.university.domain.model.Conversation;
import com.university.domain.model.Message;
import com.university.domain.model.User;
import com.university.domain.model.enums.MessageStatus;
import com.university.domain.repository.ConversationRepository;
import com.university.domain.repository.MessageRepository;
import com.university.domain.repository.UserRepository;
import com.university.web.dto.conversation.ConversationResponseDTO;
import com.university.web.dto.message.MessageCreateRequestDTO;
import com.university.web.dto.message.MessageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;
    private final ConversationMapper conversationMapper;

    @Override
    public MessageResponseDTO sendMessage(MessageCreateRequestDTO dto) {
        log.info("Sending message from user {} to user {}", dto.getSenderId(), dto.getReceiverId());

        // Validar que no se envíe mensaje a sí mismo
        if (dto.getSenderId().equals(dto.getReceiverId())) {
            throw new ErrorSistema("No puedes enviarte mensajes a ti mismo");
        }

        // Buscar usuarios
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new ErrorSistema("Remitente no encontrado: " + dto.getSenderId()));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new ErrorSistema("Destinatario no encontrado: " + dto.getReceiverId()));

        // Obtener o crear conversación
        Conversation conversation = conversationRepository
                .findByParticipants(dto.getSenderId(), dto.getReceiverId())
                .orElseGet(() -> createNewConversation(sender, receiver));

        // Crear mensaje
        Message message = messageMapper.toEntity(dto);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setConversation(conversation);

        // Guardar mensaje
        Message savedMessage = messageRepository.save(message);

        // Actualizar última actividad de la conversación
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        log.info("Message sent successfully with ID: {}", savedMessage.getId());

        return messageMapper.toResponseDTO(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public MessageResponseDTO getMessageById(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Mensaje no encontrado: " + id));

        return messageMapper.toResponseDTO(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getConversationMessages(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ErrorSistema("Conversación no encontrada: " + conversationId));

        List<Message> messages = messageRepository.findByConversationIdOrderBySentAtAsc(conversationId);

        return messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ErrorSistema("Mensaje no encontrado: " + messageId));

        if (message.getStatus() != MessageStatus.LEIDO) {
            message.setStatus(MessageStatus.LEIDO);
            message.setReadAt(LocalDateTime.now());
            messageRepository.save(message);
            log.info("Message {} marked as read", messageId);
        }
    }

    @Override
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ErrorSistema("Mensaje no encontrado: " + messageId));

        messageRepository.delete(message);
        log.info("Message {} deleted", messageId);
    }

    @Override
    public ConversationResponseDTO getOrCreateConversation(Long userId1, Long userId2) {

        // Validar que no sea la misma persona
        if (userId1.equals(userId2)) {
            throw new ErrorSistema("No puedes crear una conversación contigo mismo");
        }

        // Buscar usuarios
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado: " + userId1));

        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado: " + userId2));

        // Buscar o crear conversación
        Conversation conversation = conversationRepository
                .findByParticipants(userId1, userId2)
                .orElseGet(() -> createNewConversation(user1, user2));

        return conversationMapper.toResponseDTO(conversation, userId1);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponseDTO> getUserConversations(Long userId) {
        log.info("Getting conversations for user {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado: " + userId));

        List<Conversation> conversations = conversationRepository.findUserConversations(userId);

        return conversations.stream()
                .map(conv -> conversationMapper.toResponseDTO(conv, userId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationResponseDTO getConversationById(Long id) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Conversación no encontrada: " + id));

        return conversationMapper.toResponseDTO(conversation);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getUnreadMessageCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado: " + userId));

        Integer count = messageRepository.countUnreadMessages(userId);
        return count != null ? count : 0;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResponseDTO> searchMessages(Long userId, String keyword, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado: " + userId));

        Page<Message> messages = messageRepository.searchMessages(userId, keyword, pageable);

        return messages.map(messageMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getUnreadMessages(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado: " + userId));

        List<Message> messages = messageRepository.findUnreadMessages(userId);

        return messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Metodo auxiliar para crear nueva conversación
    private Conversation createNewConversation(User user1, User user2) {
        log.info("Creating new conversation between {} and {}", user1.getId(), user2.getId());

        Conversation conversation = Conversation.builder()
                .participant1(user1)
                .participant2(user2)
                .build();

        return conversationRepository.save(conversation);
    }
}