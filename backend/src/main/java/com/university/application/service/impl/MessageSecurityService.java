package com.university.application.service.impl;

import com.university.domain.repository.ConversationRepository;
import com.university.domain.repository.MessageRepository;
import com.university.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service("messageSecurityService")
@RequiredArgsConstructor
public class MessageSecurityService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    //Verifica si el usuario puede acceder a un mensaje específico (debe ser el remitente o destinatario)
    public boolean canAccessMessage(Long messageId) {
        if (messageId == null) return false;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        if (authUserId == null) return false;

        return messageRepository.findById(messageId)
                .map(message ->
                        Objects.equals(message.getSender().getId(), authUserId) ||
                                Objects.equals(message.getReceiver().getId(), authUserId)
                )
                .orElse(false);
    }

    //Verifica si el usuario puede acceder a una conversación
    public boolean canAccessConversation(Long conversationId) {
        if (conversationId == null) return false;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        if (authUserId == null) return false;

        return conversationRepository.findById(conversationId)
                .map(conversation ->
                        Objects.equals(conversation.getParticipant1().getId(), authUserId) ||
                                Objects.equals(conversation.getParticipant2().getId(), authUserId)
                )
                .orElse(false);
    }

    //Verifica si el usuario puede enviar un mensaje como remitente
    public boolean canSendAsUser(Long senderId) {
        if (senderId == null) return false;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        return authUserId != null && Objects.equals(authUserId, senderId);
    }

    //Verifica si el usuario puede borrar un mensaje
    public boolean canDeleteMessage(Long messageId) {
        if (messageId == null) return false;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        if (authUserId == null) return false;

        return messageRepository.findById(messageId)
                .map(message -> Objects.equals(message.getSender().getId(), authUserId))
                .orElse(false);
    }

    //Métodos auxiliares privados
    private boolean isAuthenticated(Authentication auth) {
        return auth != null &&
                auth.isAuthenticated() &&
                !(auth instanceof AnonymousAuthenticationToken);
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    private Long getAuthenticatedUserId(Authentication auth) {
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserId();
        }
        return null;
    }
}