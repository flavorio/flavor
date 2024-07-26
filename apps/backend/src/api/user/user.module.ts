import { Module } from '@nestjs/common';
import multer from 'multer';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [UserController],
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({}),
    }),
    StorageModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
