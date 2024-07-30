import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { keyBy, map } from 'lodash';
import { GetSpaceVo, SpaceRole } from '@flavor/core';

@Injectable()
export class SpaceService {
  constructor(private prisma: PrismaService) {}

  // async createWorkspace(name: string, createdBy: string) {
  //   const workspaceId = genUUID();
  //   await this.prisma.workspace.create({
  //     data: {
  //       id: workspaceId,
  //       name,
  //       createdBy,
  //       updatedBy: createdBy,
  //     },
  //   });

  //   await this.prisma.workspaceMembership.create({
  //     data: {
  //       workspaceId,
  //       userId: createdBy,
  //       role: 'OWNER',
  //     },
  //   });
  // }

  async getSpaceList(userId: string) {
    const spaces = await this.prisma.txClient().spaceMember.findMany({
      where: { userId },
      select: { spaceId: true, role: true },
    });

    const spaceIds = map(spaces, 'spaceId') as string[];
    const spaceList = await this.prisma.txClient().space.findMany({
      where: { id: { in: spaceIds } },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    });

    const roleMap = keyBy(spaces, 'spaceId');
    return spaceList.map((space) => ({
      ...space,
      role: roleMap[space.id].role,
    }));
  }

  async getSpaceInfo(spaceId: string, userId: string) {
    const space = await this.prisma.txClient().space.findUnique({
      where: { id: spaceId, active: true },
      select: { id: true, name: true },
    });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const spaceMember = await this.prisma.txClient().spaceMember.findFirst({
      where: { spaceId, userId, active: true },
      select: { spaceId: true, role: true },
    });

    const documents = await this.prisma.txClient().document.findMany({
      where: { spaceId, active: true },
    });
    return {
      ...space,
      role: spaceMember?.role,
      documents,
    };
  }

  async getSpaceMembers(spaceId: string) {
    const members = await this.prisma.txClient().spaceMember.findMany({
      where: {
        spaceId,
        active: true,
      },
      select: {
        id: true,
        spaceId: true,
        userId: true,
        role: true,
        createdAt: true,
      },
    });

    const userIds = members.map((member) => member.userId);
    const users = await this.prisma.txClient().user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatar: true, email: true },
      orderBy: { createdAt: 'desc' },
    });
    const userMap = keyBy(users, 'id');

    const spaceMembers = members.map((member) => {
      const { name: userName, avatar, email } = userMap[member.userId] || {};

      return {
        ...member,
        avatar,
        userName,
        email,
      };
    });

    return spaceMembers;
  }

  async deleteSpaceMember(spaceId: string, userId: string) {
    await this.prisma.txClient().spaceMember.updateMany({
      where: {
        spaceId,
        userId,
      },
      data: {
        active: false,
      },
    });

    return;
  }

  async updateSpaceMember(spaceId: string, userId: string, role: SpaceRole) {
    await this.prisma.txClient().spaceMember.updateMany({
      where: {
        spaceId,
        userId,
      },
      data: {
        role,
      },
    });

    return;
  }
}
