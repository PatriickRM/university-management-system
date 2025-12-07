package com.university.domain.repository;

import com.university.domain.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c WHERE " +
            "(c.participant1.id = :userId1 AND c.participant2.id = :userId2) OR " +
            "(c.participant1.id = :userId2 AND c.participant2.id = :userId1)")
    Optional<Conversation> findByParticipants(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT c FROM Conversation c WHERE c.participant1.id = :userId OR c.participant2.id = :userId " +
            "ORDER BY c.lastMessageAt DESC")
    List<Conversation> findUserConversations(@Param("userId") Long userId);
}