import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ClsService } from 'nestjs-cls';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cls: ClsService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @Post('getUserInfo')
  // public async getUserInfo(): Promise<any> {
  //   try {
  //     const userId = this.cls.get('user.id');
  //     const user = await this.userService.findByUserId(userId);
  //     return pickUserMe(user);
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  @HttpCode(HttpStatus.OK)
  @Post('getUserInfo')
  public async getUserInfo(@Req() request: Express.Request) {
    return request.user;
  }

  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 3 * 1024 * 1024, // limit file size is 3MB
      },
    }),
  )
  @Post('updateAvatar')
  async updateAvatar(@UploadedFile() file: Express.Multer.File): Promise<void> {
    const userId = this.cls.get('user.id');
    return this.userService.updateAvatar(userId, file);
  }
}
