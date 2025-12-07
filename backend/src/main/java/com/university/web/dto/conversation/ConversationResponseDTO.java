package com.university.web.dto.conversation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponseDTO {
    private Long id;
    private Long participant1Id;
    private String participant1Name;
    private String participant1Email;
    private Long participant2Id;
    private String participant2Name;
    private String participant2Email;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    private String lastMessageContent;
    private Integer unreadCount;
}
