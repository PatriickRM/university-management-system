package com.university.domain.model;

import com.university.domain.model.enums.MessageStatus;
import com.university.domain.model.enums.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_message")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType messageType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageStatus status;

    @Column(nullable = false)
    private LocalDateTime sentAt;
    private LocalDateTime readAt;

    @Column(nullable = false, length = 2000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    private String attachmentUrl;

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
        if (status == null) {
            status = MessageStatus.ENVIADO;
        }
    }
}
