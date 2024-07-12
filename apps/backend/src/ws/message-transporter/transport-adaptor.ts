import { ConnectionState, DisconnectReason, Message, MessageType } from "./message"

export interface TransportAdapter {
    getConnectionState(): ConnectionState
  
    bindOnMessageEvent(handler: (value: Message<MessageType>) => void): () => void
  
    bindOnConnectedEvent(handler: () => void): () => void
  
    bindOnErrorEvent(handler: () => void): () => void
  
    bindOnCloseEvent(handler: (reason?: DisconnectReason) => void): () => void
  
    disconnect(): void
  
    send(value: Message<MessageType>): void
  } 