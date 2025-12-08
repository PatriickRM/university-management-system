import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserSearchDialogComponent } from '../../user-search-dialog/user-search-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.model';

import { MessageService, Conversation, Message } from '../../../core/services/message.service';
import { WebSocketService, WebSocketMessage } from '../../../core/services/websocket.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-messages',
  
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="messages-container">
      <!-- Header -->
      <div class="messages-header">
        <h1>
          <mat-icon>mail</mat-icon>
          Mensajes
        </h1>
        <div class="header-actions">
          <button mat-icon-button matTooltip="Actualizar">
            <mat-icon>refresh</mat-icon>
          </button>
          <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Opciones">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="markAllAsRead()">
              <mat-icon>done_all</mat-icon>
              <span>Marcar todo como leído</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <div class="messages-content">
        <!-- Conversations List -->
        <mat-card class="conversations-panel">
          <div class="panel-header">
            <h3>Conversaciones</h3>
            <div class="header-actions">
              @if (unreadCount > 0) {
                <mat-icon [matBadge]="unreadCount" matBadgeColor="warn" matBadgeSize="small">
                  notifications
                </mat-icon>
              }
              <button mat-icon-button 
                      (click)="openNewConversation()" 
                      matTooltip="Nueva conversación"
                      color="primary">
                <mat-icon>add_comment</mat-icon>
              </button>
            </div>
          </div>

          @if (loadingConversations) {
            <div class="loading-state">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else if (conversations.length === 0) {
            <div class="empty-state">
              <mat-icon>inbox</mat-icon>
              <p>No tienes conversaciones</p>
            </div>
          } @else {
            <mat-list class="conversations-list">
              @for (conv of conversations; track conv.id) {
                <mat-list-item 
                  [class.active]="selectedConversation?.id === conv.id"
                  [class.unread]="conv.unreadCount > 0"
                  (click)="selectConversation(conv)">
                  <div class="conversation-item">
                    <div class="conv-avatar">
                      {{ getInitials(conv.otherParticipant) }}
                    </div>
                    <div class="conv-content">
                      <div class="conv-header">
                        <strong class="conv-name">{{ getFullName(conv.otherParticipant) }}</strong>
                        <span class="conv-time">{{ formatMessageTime(conv.lastMessageAt) }}</span>
                      </div>
                      <div class="conv-preview">
                        <span class="last-message">{{ conv.lastMessageContent || 'Sin mensajes' }}</span>
                        @if (conv.unreadCount > 0) {
                          <mat-icon class="unread-indicator" matBadge="{{ conv.unreadCount }}" 
                                    matBadgeColor="warn" matBadgeSize="small">
                            circle
                          </mat-icon>
                        }
                      </div>
                    </div>
                  </div>
                </mat-list-item>
                <mat-divider></mat-divider>
              }
            </mat-list>
          }
        </mat-card>

        <!-- Messages Panel -->
        <mat-card class="messages-panel">
          @if (!selectedConversation) {
            <div class="no-conversation-selected">
              <mat-icon>forum</mat-icon>
              <h3>Selecciona una conversación</h3>
              <p>Elige una conversación de la lista para ver los mensajes</p>
            </div>
          } @else {
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="chat-participant">
                <div class="participant-avatar">
                  {{ getInitials(selectedConversation.otherParticipant) }}
                </div>
                <div class="participant-info">
                  <strong>{{ getFullName(selectedConversation.otherParticipant) }}</strong>
                  @if (isTyping) {
                    <span class="typing-indicator">
                      <span class="dot"></span>
                      <span class="dot"></span>
                      <span class="dot"></span>
                      Escribiendo...
                    </span>
                  } @else {
                    <span class="participant-status">
                      {{ selectedConversation.otherParticipant?.email }}
                    </span>
                  }
                </div>
              </div>
              <div class="chat-actions">
                <button mat-icon-button matTooltip="Buscar">
                  <mat-icon>search</mat-icon>
                </button>
                <button mat-icon-button [matMenuTriggerFor]="chatMenu" matTooltip="Más opciones">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #chatMenu="matMenu">
                  <button mat-menu-item>
                    <mat-icon>archive</mat-icon>
                    <span>Archivar conversación</span>
                  </button>
                  <button mat-menu-item (click)="clearChat()">
                    <mat-icon>delete</mat-icon>
                    <span>Eliminar conversación</span>
                  </button>
                </mat-menu>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Messages List -->
            <div class="messages-list" #messagesList>
              @if (loadingMessages) {
                <div class="loading-state">
                  <mat-spinner diameter="40"></mat-spinner>
                </div>
              } @else if (messages.length === 0) {
                <div class="empty-messages">
                  <mat-icon>chat_bubble_outline</mat-icon>
                  <p>No hay mensajes en esta conversación</p>
                  <p class="sub-text">Envía el primer mensaje</p>
                </div>
              } @else {
                @for (msg of messages; track msg.id) {
                  <div class="message" [class.sent]="isSentByMe(msg)" [class.received]="!isSentByMe(msg)">
                    @if (!isSentByMe(msg)) {
                      <div class="message-avatar">
                        {{ getInitials(msg.sender) }}
                      </div>
                    }
                    <div class="message-content">
                      <div class="message-bubble">
                        <p>{{ msg.content }}</p>
                        <div class="message-footer">
                          <span class="message-time">{{ formatMessageTime(msg.sentAt) }}</span>
                          @if (isSentByMe(msg)) {
                            <mat-icon class="message-status" 
                                      [class.read]="msg.status === 'LEIDO'"
                                      matTooltip="{{ getStatusTooltip(msg.status) }}">
                              {{ getStatusIcon(msg.status) }}
                            </mat-icon>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              }
            </div>

            <mat-divider></mat-divider>

            <!-- Message Input -->
            <div class="message-input">
              <button mat-icon-button matTooltip="Adjuntar archivo">
                <mat-icon>attach_file</mat-icon>
              </button>
              <mat-form-field appearance="outline" class="input-field">
                <input matInput 
                       [(ngModel)]="newMessage" 
                       (keyup.enter)="sendMessage()"
                       (input)="onTyping()"
                       placeholder="Escribe un mensaje..." 
                       [disabled]="!selectedConversation">
              </mat-form-field>
              <button mat-fab 
                      color="primary" 
                      (click)="sendMessage()" 
                      [disabled]="!newMessage.trim() || !selectedConversation"
                      matTooltip="Enviar mensaje">
                <mat-icon>send</mat-icon>
              </button>
            </div>
          }
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .messages-container {
      height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    .messages-header {
      padding: 20px 24px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 1.5rem;
        color: #2c3e50;

        mat-icon {
          color: #667eea;
        }
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }

    .messages-content {
      flex: 1;
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 0;
      overflow: hidden;
      padding: 0;
      margin: 0;
    }

    // Conversations Panel
    .conversations-panel {
      height: 100%;
      border-radius: 0;
      border-right: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .panel-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          font-size: 1.125rem;
          color: #2c3e50;
        }
      }
      .panel-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          font-size: 1.125rem;
          color: #2c3e50;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
      .conversations-list {
        flex: 1;
        overflow-y: auto;
        padding: 0;

        mat-list-item {
          cursor: pointer;
          transition: all 0.2s ease;
          height: auto !important;
          padding: 0 !important;

          &:hover {
            background: #f8f9fa;
          }

          &.active {
            background: #e3f2fd;
          }

          &.unread {
            background: #fff3e0;

            &:hover {
              background: #ffe0b2;
            }
          }

          .conversation-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px 20px;
            width: 100%;

            .conv-avatar {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: 0.875rem;
              flex-shrink: 0;
            }

            .conv-content {
              flex: 1;
              min-width: 0;

              .conv-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;

                .conv-name {
                  font-size: 0.9375rem;
                  color: #2c3e50;
                  font-weight: 500;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .conv-time {
                  font-size: 0.75rem;
                  color: #7f8c8d;
                  flex-shrink: 0;
                  margin-left: 8px;
                }
              }

              .conv-preview {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .last-message {
                  font-size: 0.875rem;
                  color: #7f8c8d;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  flex: 1;
                }

                .unread-indicator {
                  color: #ff9800;
                  font-size: 8px;
                  width: 8px;
                  height: 8px;
                }
              }
            }
          }
        }
      }
    }

    // Messages Panel
    .messages-panel {
      height: 100%;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;

      .chat-header {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;

        .chat-participant {
          display: flex;
          align-items: center;
          gap: 12px;

          .participant-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.875rem;
          }

          .participant-info {
            display: flex;
            flex-direction: column;
            gap: 2px;

            strong {
              font-size: 1rem;
              color: #2c3e50;
            }

            .participant-status {
              font-size: 0.8125rem;
              color: #7f8c8d;
            }

            .typing-indicator {
              font-size: 0.8125rem;
              color: #667eea;
              display: flex;
              align-items: center;
              gap: 4px;

              .dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #667eea;
                animation: typing 1.4s infinite;

                &:nth-child(2) {
                  animation-delay: 0.2s;
                }

                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
          }
        }
      }

      .messages-list {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .message {
          display: flex;
          gap: 12px;
          max-width: 70%;
          animation: fadeInUp 0.3s ease;

          &.sent {
            align-self: flex-end;
            flex-direction: row-reverse;

            .message-bubble {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 18px 18px 4px 18px;
            }
          }

          &.received {
            align-self: flex-start;

            .message-bubble {
              background: white;
              color: #2c3e50;
              border-radius: 18px 18px 18px 4px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
          }

          .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.75rem;
            flex-shrink: 0;
          }

          .message-content {
            flex: 1;
            min-width: 0;

            .message-bubble {
              padding: 12px 16px;
              word-wrap: break-word;

              p {
                margin: 0 0 6px 0;
                line-height: 1.4;
              }

              .message-footer {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 6px;

                .message-time {
                  font-size: 0.6875rem;
                  opacity: 0.8;
                }

                .message-status {
                  font-size: 16px;
                  width: 16px;
                  height: 16px;
                  opacity: 0.7;

                  &.read {
                    color: #4caf50;
                    opacity: 1;
                  }
                }
              }
            }
          }
        }
      }

      .message-input {
        padding: 16px 20px;
        background: white;
        display: flex;
        align-items: center;
        gap: 12px;

        .input-field {
          flex: 1;
          margin: 0;

          ::ng-deep .mat-mdc-form-field-flex {
            height: 48px;
          }
        }

        button[mat-fab] {
          width: 48px;
          height: 48px;
        }
      }
    }

    // Empty/Loading States
    .no-conversation-selected,
    .empty-messages,
    .empty-state,
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
      color: #7f8c8d;
      height: 100%;

      mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
        opacity: 0.3;
        color: #bdc3c7;
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 1.25rem;
        color: #2c3e50;
      }

      p {
        margin: 0;
        font-size: 0.9375rem;

        &.sub-text {
          font-size: 0.875rem;
          color: #95a5a6;
        }
      }
    }

    // Animations
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-6px);
      }
    }

    // Scrollbar
    .conversations-list::-webkit-scrollbar,
    .messages-list::-webkit-scrollbar {
      width: 6px;
    }

    .conversations-list::-webkit-scrollbar-thumb,
    .messages-list::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;

      &:hover {
        background: #a0aec0;
      }
    }

    // Responsive
    @media (max-width: 768px) {
      .messages-content {
        grid-template-columns: 1fr;
      }

      .conversations-panel {
        display: none;

        &.mobile-show {
          display: flex;
        }
      }

      .messages-panel {
        &.mobile-hide {
          display: none;
        }
      }
    }
  `]
})
export class StudentMessagesComponent implements OnInit, OnDestroy {
  private messageService = inject(MessageService);
  private wsService = inject(WebSocketService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild('messagesList') messagesList!: ElementRef;

  conversations: Conversation[] = [];
  messages: Message[] = [];
  selectedConversation: Conversation | null = null;
  newMessage = '';
  currentUserId: number | null = null;
  unreadCount = 0;
  isTyping = false;

  loadingConversations = false;
  loadingMessages = false;

  private subscriptions: Subscription[] = [];
  private typingTimeout: any;

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    if (this.currentUserId) {
      this.loadConversations();
      this.connectWebSocket(this.currentUserId);
      this.subscribeToWebSocketEvents();
      this.loadUnreadCount();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.wsService.disconnect();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  connectWebSocket(userId: number): void {
    if (!this.wsService.isConnected()) {
      this.wsService.connect(userId);
    }
  }

  subscribeToWebSocketEvents(): void {
    // Suscribirse a nuevos mensajes
    const msgSub = this.wsService.onMessage().subscribe((msg: WebSocketMessage) => {
      this.handleIncomingMessage(msg);
    });

    // Suscribirse a indicadores de escritura
    const typingSub = this.wsService.onTyping().subscribe((data) => {
      if (this.selectedConversation?.otherParticipant?.id === data.senderId) {
        this.isTyping = data.isTyping;
      }
    });

    // Suscribirse a confirmaciones de lectura
    const readSub = this.wsService.onReadReceipt().subscribe((data) => {
      this.handleReadReceipt(data.messageId);
    });

    this.subscriptions.push(msgSub, typingSub, readSub);
  }

  loadConversations(): void {
  this.loadingConversations = true;
  this.messageService.getUserConversations().subscribe({
    next: (conversations) => {
      // Procesar las conversaciones para agregar otherParticipant
      this.conversations = conversations.map(conv => {
        // Determinar quién es el otro participante
        const isParticipant1 = conv.participant1Id === this.currentUserId;
        
        return {
          ...conv,
          otherParticipant: {
            id: isParticipant1 ? conv.participant2Id : conv.participant1Id,
            firstName: isParticipant1 ? 
              conv.participant2Name.split(' ')[0] : 
              conv.participant1Name.split(' ')[0],
            lastName: isParticipant1 ? 
              conv.participant2Name.split(' ').slice(1).join(' ') : 
              conv.participant1Name.split(' ').slice(1).join(' '),
            email: isParticipant1 ? conv.participant2Email : conv.participant1Email
          }
        };
      }).sort((a, b) => 
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );
      
      this.loadingConversations = false;
    },
    error: (err) => {
      console.error('Error loading conversations:', err);
      this.loadingConversations = false;
    }
  });
}

  loadUnreadCount(): void {
    this.messageService.getUnreadCount().subscribe({
      next: (result) => {
        this.unreadCount = result.unreadCount;
      },
      error: (err) => console.error('Error loading unread count:', err)
    });
  }

  selectConversation(conversation: Conversation): void {
  console.log('Selecting conversation:', conversation);
  if (!conversation.otherParticipant) {
    console.error('Conversation missing otherParticipant data');
    return;
  }
  this.selectedConversation = conversation;
  this.loadMessages(conversation.id);
}

  loadMessages(conversationId: number): void {
    this.loadingMessages = true;
    this.messageService.getConversationMessages(conversationId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loadingMessages = false;
        this.scrollToBottom();
        this.markMessagesAsRead(messages);
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loadingMessages = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation?.otherParticipant || !this.currentUserId) {
      console.warn('Cannot send message: missing data', {
        hasMessage: !!this.newMessage.trim(),
        hasConversation: !!this.selectedConversation,
        hasOtherParticipant: !!this.selectedConversation?.otherParticipant,
        hasCurrentUser: !!this.currentUserId
      });
      return;
    }

    const messageData = {
      senderId: this.currentUserId,
      receiverId: this.selectedConversation.otherParticipant.id,
      content: this.newMessage.trim(),
      messageType: 'DIRECTO' as const
    };

    // Enviar por WebSocket si está conectado
    if (this.wsService.isConnected()) {
      this.wsService.sendMessage(messageData);
    }

    // También enviar por HTTP como respaldo
    this.messageService.sendMessage(messageData).subscribe({
      next: (message) => {
        console.log('Message sent successfully:', message);
      },
      error: (err) => console.error('Error sending message:', err)
    });

    this.newMessage = '';
  }


  onTyping(): void {
    if (!this.selectedConversation?.otherParticipant?.id || !this.currentUserId) {
      console.warn('Cannot send typing indicator: missing conversation or user data');
      return;
    }

    this.wsService.sendTypingIndicator(this.selectedConversation.otherParticipant.id,this.currentUserId,true);

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      if (this.selectedConversation?.otherParticipant?.id && this.currentUserId) {
        this.wsService.sendTypingIndicator(
          this.selectedConversation.otherParticipant.id,
          this.currentUserId,
          false
        );
      }
    }, 2000);
  }

  handleIncomingMessage(wsMsg: WebSocketMessage): void {
    // Convertir WebSocketMessage a Message
    const message: Message = {
      id: wsMsg.id || Date.now(),
      sender: {
        id: wsMsg.senderId,
        firstName: '',
        lastName: '',
        email: ''
      },
      receiver: {
        id: wsMsg.receiverId,
        firstName: '',
        lastName: '',
        email: ''
      },
      content: wsMsg.content,
      messageType: wsMsg.messageType,
      status: wsMsg.status || 'ENVIADO',
      sentAt: wsMsg.sentAt || new Date().toISOString()
    };

    // Si el mensaje es de la conversación actual, agregarlo
    if (this.selectedConversation &&
        (message.sender.id === this.selectedConversation.otherParticipant?.id ||
         message.receiver.id === this.selectedConversation.otherParticipant?.id)) {
      this.messages.push(message);
      this.scrollToBottom();
      
      // Marcar como leído si es recibido
      if (message.receiver.id === this.currentUserId && wsMsg.id) {
        this.messageService.markAsRead(wsMsg.id).subscribe();
        this.wsService.sendReadReceipt(wsMsg.id, message.sender.id);
      }
    }

    // Actualizar la lista de conversaciones
    this.loadConversations();
    this.loadUnreadCount();
  }

  handleReadReceipt(messageId: number): void {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.status = 'LEIDO';
      message.readAt = new Date().toISOString();
    }
  }

  markMessagesAsRead(messages: Message[]): void {
    if (!this.currentUserId) return;

    messages
      .filter(m => m.receiver.id === this.currentUserId && m.status !== 'LEIDO')
      .forEach(m => {
        this.messageService.markAsRead(m.id).subscribe();
        this.wsService.sendReadReceipt(m.id, m.sender.id);
      });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesList) {
        const element = this.messagesList.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  isSentByMe(message: Message): boolean {
    return message.sender.id === this.currentUserId;
  }

  getInitials(person: any): string {
  if (!person) return '?';
  
  // Si es un objeto con firstName y lastName
  if (person.firstName && person.lastName) {
    const first = person.firstName.charAt(0) || '';
    const last = person.lastName.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }
  
  // Si es un nombre completo como string
  if (typeof person === 'string') {
    const parts = person.split(' ');
    const first = parts[0]?.charAt(0) || '';
    const last = parts[1]?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  }
  return '?';
}

getFullName(person: any): string {
  if (!person) return 'Usuario';
    if (person.firstName && person.lastName) {
    return `${person.firstName} ${person.lastName}`.trim() || 'Usuario';
  }
    if (typeof person === 'string') {
    return person || 'Usuario';
  }
  
  return 'Usuario';
}


formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days === 0) {
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes === 0) {
        return 'Ahora';
      }
      return `Hace ${minutes} min`;
    }
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return `Ayer ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (days < 7) {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

getStatusIcon(status: string): string {
  switch (status) {
    case 'ENVIADO':
      return 'check';
    case 'ENTREGADO':
      return 'done_all';
    case 'LEIDO':
      return 'done_all';
    default:
      return 'schedule';
  }
}

getStatusTooltip(status: string): string {
  switch (status) {
    case 'ENVIADO':
      return 'Enviado';
    case 'ENTREGADO':
      return 'Entregado';
    case 'LEIDO':
      return 'Leído';
    default:
      return 'Pendiente';
  }
}

markAllAsRead(): void {
  if (!this.currentUserId) return;

  // Obtener todos los mensajes no leídos
  this.messageService.getUnreadMessages().subscribe({
    next: (unreadMessages) => {
      // Marcar cada mensaje como leído
      unreadMessages.forEach(msg => {
        this.messageService.markAsRead(msg.id).subscribe({
          next: () => {
            // Enviar confirmación de lectura por WebSocket
            this.wsService.sendReadReceipt(msg.id, msg.sender.id);
          },
          error: (err) => console.error('Error marcando mensaje como leído:', err)
        });
      });

      // Actualizar el contador de no leídos
      this.loadUnreadCount();
      
      // Recargar conversaciones para actualizar los contadores
      this.loadConversations();

      // Si hay una conversación seleccionada, actualizar los mensajes
      if (this.selectedConversation) {
        this.loadMessages(this.selectedConversation.id);
      }
    },
    error: (err) => console.error('Error obteniendo mensajes no leídos:', err)
  });
}

clearChat(): void {
  if (!this.selectedConversation) return;

  if (confirm('¿Estás seguro de que deseas eliminar toda la conversación? Esta acción no se puede deshacer.')) {
    // Obtener todos los mensajes de la conversación
    const messagesToDelete = this.messages.filter(msg => 
      msg.sender.id === this.currentUserId
    );

    // Eliminar cada mensaje (solo los enviados por el usuario actual)
    let deletedCount = 0;
    messagesToDelete.forEach(msg => {
      this.messageService.deleteMessage(msg.id).subscribe({
        next: () => {
          deletedCount++;
          
          // Si se eliminaron todos los mensajes, actualizar la vista
          if (deletedCount === messagesToDelete.length) {
            this.messages = this.messages.filter(m => m.sender.id !== this.currentUserId);
            
            // Si no quedan mensajes, deseleccionar la conversación
            if (this.messages.length === 0) {
              this.selectedConversation = null;
              this.loadConversations();
            }
          }
        },
        error: (err) => console.error('Error eliminando mensaje:', err)
      });
    });
  }
}

openNewConversation(): void {
  const dialogRef = this.dialog.open(UserSearchDialogComponent, {
    width: '600px',
    maxHeight: '80vh',
    disableClose: false
  });

  dialogRef.afterClosed().subscribe((selectedUser: User | undefined) => {
    if (selectedUser && this.currentUserId) {
      this.messageService.getOrCreateConversation(selectedUser.id).subscribe({
        next: (conversation) => {
          this.selectConversation(conversation);
          // Recargar conversaciones para mostrar la nueva
          this.loadConversations();
        },
        error: (err) => console.error('Error creating conversation:', err)
      });
    }
  });
}

//Refresh 
refreshConversations(): void {
  this.loadConversations();
  this.loadUnreadCount();
  
  if (this.selectedConversation) {
    this.loadMessages(this.selectedConversation.id);
        }
    }
    
}
