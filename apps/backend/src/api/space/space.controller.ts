import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { ClsService } from 'nestjs-cls';
import { GetSpaceInfoRequest } from './space.dto';

@Controller('api/space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly cls: ClsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('getSpaceList')
  public async getSpaceList(): Promise<any> {
    try {
      const userId = this.cls.get('user.id');
      return await this.spaceService.getSpaceList(userId);
    } catch (e) {
      throw e;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('getSpaceInfo')
  public async getSpaceInfo(
    @Body() body: GetSpaceInfoRequest,
  ): Promise<any> {
    return await this.spaceService.getSpaceInfo(body.id);
  }
}
