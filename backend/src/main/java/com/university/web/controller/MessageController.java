package com.university.web.controller;

import com.university.application.exception.ErrorSistema;
import com.university.application.service.MessageService;
import com.university.security.CustomUserDetails;
import com.university.web.dto.message.MessageCreateRequestDTO;
import com.university.web.dto.message.MessageResponseDTO;
import com.university.web.dto.conversation.ConversationResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    // Enviar mensaje
    @PostMapping
    @PreAuthorize("isAuthenticated() and @messageSecurityService.canSendAsUser(#dto.senderId)")
    public ResponseEntity<MessageResponseDTO> sendMessage(@Valid @RequestBody MessageCreateRequestDTO dto) {
        MessageResponseDTO response = messageService.sendMessage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Obtener mensaje por ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @messageSecurityService.canAccessMessage(#id)")
    public ResponseEntity<MessageResponseDTO> getMessageById(@PathVariable Long id) {
        MessageResponseDTO response = messageService.getMessageById(id);
        return ResponseEntity.ok(response);
    }

    // Obtener conversaciones del usuario
    @GetMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ConversationResponseDTO>> getUserConversations() {
        // Obtener ID del usuario autenticado desde el contexto de seguridad
        Long userId = getCurrentUserId();
        List<ConversationResponseDTO> response = messageService.getUserConversations(userId);
        return ResponseEntity.ok(response);
    }

    // Obtener conversación específica
    @GetMapping("/conversations/{conversationId}")
    @PreAuthorize("isAuthenticated() and @messageSecurityService.canAccessConversation(#conversationId)")
    public ResponseEntity<ConversationResponseDTO> getConversation(@PathVariable Long conversationId) {
        ConversationResponseDTO response = messageService.getConversationById(conversationId);
        return ResponseEntity.ok(response);
    }

    // Obtener mensajes de una conversación
    @GetMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("isAuthenticated() and @messageSecurityService.canAccessConversation(#conversationId)")
    public ResponseEntity<List<MessageResponseDTO>> getConversationMessages(@PathVariable Long conversationId) {
        List<MessageResponseDTO> response = messageService.getConversationMessages(conversationId);
        return ResponseEntity.ok(response);
    }

    // Iniciar conversación con otro usuario
    @PostMapping("/conversations/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConversationResponseDTO> startConversation(@RequestParam Long otherUserId) {
        Long userId = getCurrentUserId();
        ConversationResponseDTO response = messageService.getOrCreateConversation(userId, otherUserId);
        return ResponseEntity.ok(response);
    }

    // Marcar mensaje como leído
    @PatchMapping("/{messageId}/read")
    @PreAuthorize("isAuthenticated() and @messageSecurityService.canAccessMessage(#messageId)")
    public ResponseEntity<MessageResponseDTO> markAsRead(@PathVariable Long messageId) {
        messageService.markAsRead(messageId);
        MessageResponseDTO response = messageService.getMessageById(messageId);
        return ResponseEntity.ok(response);
    }

    // Obtener mensajes no leídos
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponseDTO>> getUnreadMessages() {
        Long userId = getCurrentUserId();
        List<MessageResponseDTO> response = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(response);
    }

    // Obtener conteo de mensajes no leídos
    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Integer>> getUnreadCount() {
        Long userId = getCurrentUserId();
        Integer count = messageService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    // Buscar mensajes
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<MessageResponseDTO>> searchMessages(
            @RequestParam String keyword,
            @PageableDefault(size = 20, sort = "sentAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Long userId = getCurrentUserId();
        Page<MessageResponseDTO> response = messageService.searchMessages(userId, keyword, pageable);
        return ResponseEntity.ok(response);
    }

    // Eliminar mensaje
    @DeleteMapping("/{messageId}")
    @PreAuthorize("isAuthenticated() and @messageSecurityService.canDeleteMessage(#messageId)")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok(Map.of("mensaje", "Mensaje eliminado correctamente"));
    }

    // Metodo auxiliar para obtener ID del usuario autenticado
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            return userDetails.getUserId();
        }
        throw new ErrorSistema("Usuario no autenticado");
    }
}   