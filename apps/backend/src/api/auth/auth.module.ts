import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SessionModule } from './session/session.module';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategy/local.strategy';
import { SessionStrategy } from './strategy/session.strategy';
import { AuthGuard } from './guard/auth.guard';
import { SessionSerializer } from './session/session.serializer';
import { SessionStoreService } from './session/session-store.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    SessionModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionStrategy,
    UserService,
    AuthGuard,
    SessionSerializer,
    SessionStoreService,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
