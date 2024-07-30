import {
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WsService } from './ws.service';
import { Logger } from '@nestjs/common';
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { MessageTransporter } from './message-transporter/message-transporter';
import { WsTransportAdaptor } from './ws-transport-adaptor';

@WebSocketGateway({
  path: '/ws',
  // perMessageDeflate: true
})
export class WsGateway implements OnGatewayInit {
  constructor(private readonly wsService: WsService) {}

  afterInit(@ConnectedSocket() socket: WebSocket) {}

  private logger = new Logger(WsGateway.name);

  handleDisconnect() {
    this.logger.log('ws:on:close');
  }

  async handleConnection(clientSocket: WebSocket, request: IncomingMessage) {
    try {
      this.logger.log('ws:on:connection');
      this.findUserByRequest(request);
      const websocketTransportor = new MessageTransporter();
      websocketTransportor.setAdapter(new WsTransportAdaptor(clientSocket));

      websocketTransportor.markAsReady();
    } catch (error: unknown) {
      this.logger.error(
        `Error occurred while initializing: ${(error as Error).message}`,
        (error as Error).stack,
        'handleConnection',
      );
      clientSocket.close();
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: unknown, payload: any) {
    this.logger.log('ws:on:message', payload);
    return 'hello world';
  }

  private async findUserByRequest(request: IncomingMessage) {
    // const url = new URL(request.url, `http://${request.headers.host}`);
  }
}
