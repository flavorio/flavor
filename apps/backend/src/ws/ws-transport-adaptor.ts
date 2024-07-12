import {
  ConnectionState,
  DisconnectReason,
  Message,
  MessageType,
} from './message-transporter/message';
import { TransportAdapter } from './message-transporter/transport-adaptor';
import WebSocket, { CloseEvent, MessageEvent } from 'ws';

export class WsTransportAdaptor implements TransportAdapter {
  constructor(private socket: WebSocket) {}

  bindOnCloseEvent(handler: (reason?: DisconnectReason) => void) {
    function callback(event: CloseEvent): void {
      handler(event.code);
    }
    this.socket.addEventListener('close', callback);
    return () => {
      this.socket.removeEventListener('close', callback);
    };
  }

  bindOnConnectedEvent(handler: () => void): () => void {
    this.socket.addEventListener('open', handler);
    return () => {
      this.socket.removeEventListener('open', handler);
    };
  }

  bindOnErrorEvent(handler: () => void) {
    this.socket.addEventListener('error', handler);
    return () => {
      this.socket.removeEventListener('error', handler);
    };
  }

  bindOnMessageEvent(handler: (value: Message<MessageType>) => void) {
    function adjustedHandler(message: MessageEvent) {
      if (typeof message.data !== 'string') {
        return;
      }

      handler(JSON.parse(message.data) as Message<MessageType>);
    }

    this.socket.addEventListener('message', adjustedHandler);
    return () => {
      this.socket.removeEventListener('message', adjustedHandler);
    };
  }

  disconnect(): void {
    this.socket.close();
  }

  getConnectionState(): ConnectionState {
    if (this.socket.readyState === WebSocket.OPEN) {
      return ConnectionState.connected;
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      return ConnectionState.connecting;
    } else {
      return ConnectionState.disconnected;
    }
  }

  send(message: Message<MessageType>): void {
    this.socket.send(JSON.stringify(message));
  }
}
