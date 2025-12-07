package com.university.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conversation")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participant1_id", nullable = false)
    private User participant1;

    @ManyToOne
    @JoinColumn(name = "participant2_id", nullable = false)
    private User participant2;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastMessageAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastMessageAt = LocalDateTime.now();
    }
}
