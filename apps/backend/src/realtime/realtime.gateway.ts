import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import type { Request } from 'express';
import type { Server } from 'ws';
import { RealtimeService } from './realtime.service';
import type { WebSocketMinimal } from '@tldraw/sync-core';

@WebSocketGateway({
  path: '/realtime',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private readonly realtimeService: RealtimeService) {}

  private logger = new Logger(RealtimeGateway.name);

  afterInit(server: Server) {
    this.logger.log('WsGateway afterInit');
    server.on('connection', async (socket, request: Request) => {
      try {
        this.logger.log('ws:on:connection');
        const roomId = request.query['roomId'] as string;
        const sessionId = request.query['sessionId'] as string;
        const room = await this.realtimeService.makeOrLoadRoom(roomId);
        room.handleSocketConnect({
          sessionId,
          socket: socket as WebSocketMinimal,
        });
      } catch (error) {
        socket.send(JSON.stringify({ error }));
        socket.close();
      }
    });
  }

  handleDisconnect() {
    this.logger.log('ws:on:close');
  }

  handleConnection(client: unknown) {
    this.logger.log('ws:on:connection', client);
  }
}
