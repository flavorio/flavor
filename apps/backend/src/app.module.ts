import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { SpaceModule } from './api/space/space.module';
import { WsModule } from './ws/ws.module';
import { GlobalModule } from 'src/global/global.module';
import { DocumentModule } from './api/document/document.module';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    UserModule,
    SpaceModule,
    WsModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
