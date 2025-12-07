package com.university.web.dto.conversation;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationCreateRequestDTO {
    @NotNull(message = "Participant 1 ID is required")
    private Long participant1Id;

    @NotNull(message = "Participant 2 ID is required")
    private Long participant2Id;
}