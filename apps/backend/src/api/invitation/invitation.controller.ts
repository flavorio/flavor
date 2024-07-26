import { Body, Controller, Post } from '@nestjs/common';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { InvitationService } from './invitation.service';
import { ZodValidationPipe } from 'src/zod.validation.pipe';
import {
  AcceptInvitationLinkRo,
  CreateSpaceInvitationLinkRo,
  DeleteSpaceInvitationLinkRo,
  UpdateSpaceInvitationLinkRo,
  acceptInvitationLinkRoSchema,
  createSpaceInvitationLinkRoSchema,
  deleteSpaceInvitationLinkRoSchema,
  updateSpaceInvitationLinkRoSchema,
} from '@flavor/core';
import { ResourceMeta } from '../auth/decorator/resource-meta.decorator';

@Controller('api/invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Permissions('space|invite_link')
  @ResourceMeta('spaceId', 'body')
  @Post('createInvitationLink')
  async createInvitationLink(
    @Body(new ZodValidationPipe(createSpaceInvitationLinkRoSchema))
    ro: CreateSpaceInvitationLinkRo,
  ) {
    const { spaceId, role } = ro;
    return await this.invitationService.createInvitationLinkBySpace(
      spaceId,
      role,
    );
  }

  @Permissions('space|invite_link')
  @ResourceMeta('spaceId', 'body')
  @Post('deleteInvitationLink')
  async deleteInvitationLink(
    @Body(new ZodValidationPipe(deleteSpaceInvitationLinkRoSchema))
    ro: DeleteSpaceInvitationLinkRo,
  ) {
    const { spaceId, invitationId } = ro;
    return await this.invitationService.deleteInvitationLinkBySpace(
      spaceId,
      invitationId,
    );
  }

  @Permissions('space|invite_link')
  @ResourceMeta('spaceId', 'body')
  @Post('updateInvitationLink')
  async updateInvitationLink(
    @Body(new ZodValidationPipe(updateSpaceInvitationLinkRoSchema))
    ro: UpdateSpaceInvitationLinkRo,
  ) {
    const { spaceId, invitationId, role } = ro;
    return await this.invitationService.updateInvitationLinkBySpace(
      spaceId,
      invitationId,
      role,
    );
  }

  @Post('acceptInvitationLink')
  async acceptInvitationLink(
    @Body(new ZodValidationPipe(acceptInvitationLinkRoSchema))
    ro: AcceptInvitationLinkRo,
  ) {
    const { invitationId, invitationCode } = ro;
    return await this.invitationService.acceptInvitationLink(
      invitationId,
      invitationCode,
    );
  }
}
