import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  providers: [AttachmentService],
  controllers: [AttachmentController],
  imports: [StorageModule,  AuthModule],
  exports: [AttachmentService],
})
export class AttachmentModule {}
