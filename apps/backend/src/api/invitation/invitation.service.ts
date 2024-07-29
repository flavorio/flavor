import dayjs from 'dayjs';
import { SpaceRole, generateInvitationId } from '@flavor/core';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/prisma';
import { IClsStore } from 'src/types/cls';
import { UserService } from '../user/user.service';
import { generateInvitationCode } from 'src/utils/code.util';
import { IMailConfig } from 'src/config/mail.config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly configService: ConfigService,
  ) {}

  private generateInviteUrl(invitationId: string, invitationCode: string) {
    const mailConfig = this.configService.get<IMailConfig>('mail');
    return `${mailConfig?.origin}/invite?invitationId=${invitationId}&invitationCode=${invitationCode}`;
  }

  async createInvitationLinkBySpace(spaceId: string, spaceRole: SpaceRole) {
    const { id, role, createdBy, createdAt, invitationCode } =
      await this.createInvitationBySpace('link', spaceId, spaceRole);
    return {
      invitationId: id,
      role: role as SpaceRole,
      createdBy,
      createdAt: createdAt.toISOString(),
      inviteUrl: this.generateInviteUrl(id, invitationCode),
      invitationCode,
    };
  }

  async createInvitationBySpace(
    type: 'link' | 'email',
    spaceId: string,
    role: SpaceRole,
  ) {
    const userId = this.cls.get('user.id');
    const invitationId = generateInvitationId();

    return await this.prismaService.txClient().invitation.create({
      data: {
        id: invitationId,
        invitationCode: generateInvitationCode(invitationId),
        spaceId,
        role,
        type,
        expiredAt:
          type === 'email'
            ? dayjs(new Date()).add(1, 'month').toDate().toISOString()
            : null,
        createdBy: userId,
      },
    });
  }

  async deleteInvitationLinkBySpace(spaceId: string, invitationId: string) {
    await this.prismaService.txClient().invitation.update({
      where: { id: invitationId, spaceId, type: 'link' },
      data: { active: false },
    });
  }

  async updateInvitationLinkBySpace(
    spaceId: string,
    invitationId: string,
    spaceRole: SpaceRole,
  ) {
    const { id, role } = await this.prismaService.txClient().invitation.update({
      where: { id: invitationId, spaceId, type: 'link' },
      data: { role: spaceRole },
    });
    return {
      invitationId: id,
      role: role as SpaceRole,
    };
  }

  async getInvitationLinkBySpace(spaceId: string) {
    const data = await this.prismaService.txClient().invitation.findMany({
      select: {
        id: true,
        role: true,
        createdBy: true,
        createdAt: true,
        invitationCode: true,
      },
      where: { spaceId, type: 'link', active: true },
    });
    return data.map(({ id, role, createdBy, createdAt, invitationCode }) => ({
      invitationId: id,
      role: role as SpaceRole,
      createdBy,
      createdAt: createdAt.toISOString(),
      invitationCode,
      inviteUrl: this.generateInviteUrl(id, invitationCode),
    }));
  }

  async acceptInvitationLink(invitationId: string, invitationCode: string) {
    const userId = this.cls.get('user.id');
    if (generateInvitationCode(invitationId) !== invitationCode) {
      throw new BadRequestException('invalid code');
    }

    const link = await this.prismaService.txClient().invitation.findFirst({
      where: {
        id: invitationId,
        active: true,
      },
    });
    if (!link) {
      throw new NotFoundException(`link ${invitationId} not found`);
    }

    const { expiredAt, spaceId, role, createdBy, type } = link;

    if (expiredAt && expiredAt < new Date()) {
      throw new ForbiddenException('link has expired');
    }

    const exist = await this.prismaService
      .txClient()
      .spaceMember.count({ where: { userId, spaceId, active: true } });
    if (!exist) {
      await this.prismaService.$tx(async () => {
        await this.prismaService.txClient().spaceMember.create({
          data: {
            spaceId,
            role,
            userId,
            createdBy: createdBy,
          },
        });

        await this.prismaService.txClient().invitationRecord.create({
          data: {
            invitationId: link.id,
            inviter: createdBy,
            accepter: userId,
            type: 'link',
            spaceId,
          },
        });
      });
    }
    return { spaceId };
  }
}
