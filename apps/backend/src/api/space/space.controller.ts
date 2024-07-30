import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { SpaceService } from './space.service';
import { ClsService } from 'nestjs-cls';
import {
  DeleteSpaceMemberRo,
  deleteSpaceMemberRoSchema,
  IdRo,
  idSchema,
  UpdateSpaceMemberRo,
  updateSpaceMemberRoSchema,
} from '@flavor/core';
import { ZodValidationPipe } from 'src/zod.validation.pipe';
import { InvitationService } from '../invitation/invitation.service';

@Controller('api/space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly invitationService: InvitationService,
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
    const userId = this.cls.get('user.id');
    return await this.spaceService.getSpaceInfo(body.id, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('getSpaceInviteLinks')
  public async getSpaceInviteLinks(
    @Body(new ZodValidationPipe(idSchema)) body: IdRo,
  ): Promise<any> {
    return await this.invitationService.getInvitationLinkBySpace(body.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('getSpaceMembers')
  public async getSpaceMembers(
    @Body(new ZodValidationPipe(idSchema)) body: IdRo,
  ): Promise<any> {
    return await this.spaceService.getSpaceMembers(body.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('deleteSpaceMember')
  public async deleteSpaceMember(
    @Body(new ZodValidationPipe(deleteSpaceMemberRoSchema))
    ro: DeleteSpaceMemberRo,
  ): Promise<any> {
    const { spaceId, userId } = ro;
    return await this.spaceService.deleteSpaceMember(spaceId, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('updateSpaceMember')
  public async updateSpaceMember(
    @Body(new ZodValidationPipe(updateSpaceMemberRoSchema))
    ro: UpdateSpaceMemberRo,
  ): Promise<any> {
    const { spaceId, userId, role } = ro;
    return await this.spaceService.updateSpaceMember(spaceId, userId, role);
  }
}
