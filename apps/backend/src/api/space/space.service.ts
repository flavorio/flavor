import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { keyBy, map } from 'lodash';
import { GetSpaceVo } from '@flavor/core';

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
    const spaces = await this.prisma.spaceMember.findMany({
      where: { userId },
      select: { spaceId: true, role: true },
    });

    const spaceIds = map(spaces, 'spaceId') as string[];
    const spaceList = await this.prisma.space.findMany({
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

  async getSpaceInfo(spaceId: string) {
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId, active: true },
      select: { id: true, name: true },
    });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const documents = await this.prisma.document.findMany({
      where: { spaceId, active: true },
    });
    return {
      ...space,
      documents,
    };
  }
}
