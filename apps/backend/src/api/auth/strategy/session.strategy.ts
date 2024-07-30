import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { UserService } from '../../user/user.service';
import { pickUserMe } from '../utils';
import { PassportSessionStrategy } from './session.passport';

@Injectable()
export class SessionStrategy extends PassportStrategy(PassportSessionStrategy) {
  constructor(
    // @AuthConfig() readonly config: ConfigType<typeof authConfig>,
    private readonly userService: UserService,
    private readonly cls: ClsService,
  ) {
    super();
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    this.cls.set('user.id', user.id);
    this.cls.set('user.name', user.name);
    this.cls.set('user.email', user.email);
    return pickUserMe(user);
  }
}
