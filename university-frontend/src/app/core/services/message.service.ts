import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Message {
  id: number;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  content: string;
  messageType: 'DIRECTO' | 'GRUPO';
  status: 'ENVIADO' | 'LEIDO' | 'ENTREGADO';
  sentAt: string;
  readAt?: string;
  attachmentUrl?: string;
}

export interface Conversation {
  id: number;
  participant1Id: number;
  participant1Name: string;
  participant1Email: string;
  participant2Id: number;
  participant2Name: string;
  participant2Email: string;
  createdAt: string;
  lastMessageAt: string;
  lastMessageContent?: string;
  unreadCount: number;
  otherParticipant?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface MessageCreateRequest {
  senderId: number;
  receiverId: number;
  content: string;
  messageType: 'DIRECTO' | 'GRUPO';
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/messages`;

  // Enviar mensaje (vía HTTP, también se usa WebSocket)
  sendMessage(request: MessageCreateRequest): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, request);
  }

  // Obtener conversaciones del usuario
  getUserConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  // Obtener mensajes de una conversación
  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  // Obtener o crear conversación con otro usuario
  getOrCreateConversation(otherUserId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations/start`, null, {
      params: { otherUserId: otherUserId.toString() }
    });
  }

  // Marcar mensaje como leído
  markAsRead(messageId: number): Observable<Message> {
    return this.http.patch<Message>(`${this.apiUrl}/${messageId}/read`, {});
  }

  // Obtener mensajes no leídos
  getUnreadMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/unread`);
  }

  // Obtener contador de mensajes no leídos
  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/unread/count`);
  }

  // Buscar mensajes
  searchMessages(keyword: string, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/search`, {
      params: {
        keyword,
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  // Eliminar mensaje
  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }
}
