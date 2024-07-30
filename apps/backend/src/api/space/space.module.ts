import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { InvitationService } from '../invitation/invitation.service';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, InvitationService],
})
export class SpaceModule {}
