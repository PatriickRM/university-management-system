package com.university.domain.repository;

import com.university.domain.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderBySentAtAsc(Long conversationId);

    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND m.status != 'READ' ORDER BY m.sentAt DESC")
    List<Message> findUnreadMessages(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.status != 'READ'")
    Integer countUnreadMessages(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) " +
            "AND m.content LIKE %:keyword% ORDER BY m.sentAt DESC")
    Page<Message> searchMessages(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);
}
