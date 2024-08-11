import { Module } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { RealtimeGateway } from './realtime.gateway';
import { DocumentModule } from 'src/api/document/document.module';

@Module({
  providers: [RealtimeGateway, RealtimeService],
  imports: [DocumentModule],
})
export class RealtimeModule {}
