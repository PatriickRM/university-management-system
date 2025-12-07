package com.university.application.mapper.impl;

import com.university.application.mapper.MessageMapper;
import com.university.domain.model.Message;
import com.university.domain.model.enums.MessageStatus;
import com.university.domain.model.enums.MessageType;
import com.university.web.dto.message.MessageCreateRequestDTO;
import com.university.web.dto.message.MessageResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class MessageMapperImpl implements MessageMapper {

    @Override
    public Message toEntity(MessageCreateRequestDTO dto) {
        return Message.builder()
                .content(dto.getContent())
                .attachmentUrl(dto.getAttachmentUrl())
                .messageType(MessageType.DIRECTO)
                .status(MessageStatus.ENVIADO)
                .build();
    }

    @Override
    public MessageResponseDTO toResponseDTO(Message message) {
        if (message == null) return null;

        return MessageResponseDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .senderEmail(message.getSender().getEmail())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName())
                .receiverEmail(message.getReceiver().getEmail())
                .content(message.getContent())
                .status(message.getStatus())
                .sentAt(message.getSentAt())
                .readAt(message.getReadAt())
                .attachmentUrl(message.getAttachmentUrl())
                .conversationId(message.getConversation() != null ? message.getConversation().getId() : null)
                .build();
    }
}