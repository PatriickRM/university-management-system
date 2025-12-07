package com.university.web.controller;

import com.university.application.service.MessageService;
import com.university.web.dto.message.MessageCreateRequestDTO;
import com.university.web.dto.message.MessageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketMessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    //Enviar mensaje en tiempo real
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageCreateRequestDTO dto, SimpMessageHeaderAccessor headerAccessor) {
        try {
            log.info("Received WebSocket message from {} to {}", dto.getSenderId(), dto.getReceiverId());

            // Guardar mensaje en BD
            MessageResponseDTO message = messageService.sendMessage(dto);

            // Enviar al destinatario: /user/{receiverId}/queue/messages
            messagingTemplate.convertAndSendToUser(String.valueOf(dto.getReceiverId()), "/queue/messages", message);

            // Confirmar al remitente: /user/{senderId}/queue/messages
            messagingTemplate.convertAndSendToUser(String.valueOf(dto.getSenderId()), "/queue/messages", message);

            log.info("Message delivered via WebSocket");
        } catch (Exception e) {
            log.error("Error sending WebSocket message", e);
        }
    }

    //Notificar que el usuario está escribiendo
    @MessageMapping("/chat.typing")
    public void userTyping(@Payload Map<String, Object> typingData) {
        try {
            Long receiverId = ((Number) typingData.get("receiverId")).longValue();
            Long senderId = ((Number) typingData.get("senderId")).longValue();
            Boolean isTyping = (Boolean) typingData.get("isTyping");

            log.debug("User {} typing status: {} to user {}", senderId, isTyping, receiverId);

            //Enviar notificación al destinatario: /user/{receiverId}/queue/typing
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(receiverId),
                    "/queue/typing",
                    Map.of("senderId", senderId, "isTyping", isTyping)
            );
        } catch (Exception e) {
            log.error("Error sending typing notification", e);
        }
    }

    //Notificar que un mensaje fue leído
    @MessageMapping("/chat.read")
    public void messageRead(@Payload Map<String, Object> readData) {
        try {
            Long messageId = ((Number) readData.get("messageId")).longValue();
            Long senderId = ((Number) readData.get("senderId")).longValue();

            log.debug("Message {} marked as read", messageId);

            //Marcar como leído en BD
            messageService.markAsRead(messageId);

            //Notificar al remitente: /user/{senderId}/queue/read
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(senderId), "/queue/read", Map.of("messageId", messageId));
        } catch (Exception e) {
            log.error("Error processing read receipt", e);
        }
    }
}
