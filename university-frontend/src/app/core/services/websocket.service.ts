import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface WebSocketMessage {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  messageType: 'DIRECTO' | 'GRUPO';
  sentAt?: string;
  status?: 'ENVIADO' | 'LEIDO' | 'ENTREGADO';
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client | null = null;
  private connected = false;
  private messageSubject = new Subject<WebSocketMessage>();
  private typingSubject = new Subject<{ senderId: number; isTyping: boolean }>();
  private readReceiptSubject = new Subject<{ messageId: number }>();

  constructor(private authService: AuthService) {}

  connect(userId: number): void {
    if (this.connected) {
      console.log('WebSocket ya está conectado');
      return;
    }

    // Configurar el cliente STOMP
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl.replace('/api', '')}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log('WebSocket conectado');
        this.connected = true;
        this.subscribeToUserQueue(userId);
      },
      
      onDisconnect: () => {
        console.log('WebSocket desconectado');
        this.connected = false;
      },
      
      onStompError: (frame) => {
        console.error('Error STOMP:', frame);
      }
    });

    this.client.activate();
  }

  private subscribeToUserQueue(userId: number): void {
    if (!this.client) return;

    // Suscribirse a mensajes personales
    this.client.subscribe(`/user/${userId}/queue/messages`, (message: IMessage) => {
      const msg = JSON.parse(message.body) as WebSocketMessage;
      this.messageSubject.next(msg);
    });

    // Suscribirse a notificaciones de escritura
    this.client.subscribe(`/user/${userId}/queue/typing`, (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.typingSubject.next(data);
    });

    // Suscribirse a confirmaciones de lectura
    this.client.subscribe(`/user/${userId}/queue/read`, (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.readReceiptSubject.next(data);
    });
  }

  sendMessage(message: WebSocketMessage): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket no está conectado');
      return;
    }

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message)
    });
  }

  sendTypingIndicator(receiverId: number, senderId: number, isTyping: boolean): void {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({ receiverId, senderId, isTyping })
    });
  }

  sendReadReceipt(messageId: number, senderId: number): void {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: '/app/chat.read',
      body: JSON.stringify({ messageId, senderId })
    });
  }

  onMessage(): Observable<WebSocketMessage> {
    return this.messageSubject.asObservable();
  }

  onTyping(): Observable<{ senderId: number; isTyping: boolean }> {
    return this.typingSubject.asObservable();
  }

  onReadReceipt(): Observable<{ messageId: number }> {
    return this.readReceiptSubject.asObservable();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}