import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { SpaceService } from './space.service';
import { ClsService } from 'nestjs-cls';
import { IdRo, idSchema } from '@flavor/core';
import { ZodValidationPipe } from 'src/zod.validation.pipe';

@Controller('api/space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly cls: ClsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('getSpaceList')
  public async getSpaceList(): Promise<any> {
    const userId = this.cls.get('user.id');
    return await this.spaceService.getSpaceList(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('getSpaceInfo')
  public async getSpaceInfo(
    @Body(new ZodValidationPipe(idSchema)) body: IdRo,
  ): Promise<any> {
    return await this.spaceService.getSpaceInfo(body.id);
  }
}
