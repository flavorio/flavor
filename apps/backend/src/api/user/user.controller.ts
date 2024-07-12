import { Controller, Post, UseGuards, Request, HttpStatus, HttpCode, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ClsService } from 'nestjs-cls';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly cls: ClsService) {}

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
}
