package com.university.application.mapper;

import com.university.domain.model.Message;
import com.university.web.dto.message.MessageCreateRequestDTO;
import com.university.web.dto.message.MessageResponseDTO;

public interface MessageMapper {
    Message toEntity(MessageCreateRequestDTO dto);
    MessageResponseDTO toResponseDTO(Message message);
}
