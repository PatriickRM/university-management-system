package com.university.web.dto.message;

import com.university.domain.model.enums.MessageStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private Long receiverId;
    private String receiverName;
    private String receiverEmail;
    private String content;
    private MessageStatus status;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private String attachmentUrl;
    private Long conversationId;
}
