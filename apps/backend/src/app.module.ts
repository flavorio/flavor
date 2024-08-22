import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NextModule } from './next/next.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { SpaceModule } from './api/space/space.module';
import { RealtimeModule } from './realtime/realtime.module';
import { GlobalModule } from 'src/global/global.module';
import { DocumentModule } from './api/document/document.module';
import { AttachmentModule } from './api/attachment/attachment.module';
import { InvitationModule } from './api/invitation/invitation.module';

@Module({
  imports: [
    GlobalModule,
    NextModule,
    AttachmentModule,
    UserModule,
    AuthModule,
    SpaceModule,
    RealtimeModule,
    DocumentModule,
    InvitationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
