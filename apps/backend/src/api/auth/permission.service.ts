import {
  IdPrefix,
  PermissionAction,
  RoleType,
  SpaceRole,
  getPermissions,
} from '@flavor/core';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { intersection } from 'lodash';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/prisma/prisma.service';
import { IClsStore } from 'src/types/cls';

@Injectable()
export class PermissionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
  ) {}

  async getRoleBySpaceId(spaceId: string) {
    const userId = this.cls.get('user.id');

    const collaborator = await this.prismaService.txClient().spaceMember.findFirst({
      where: {
        userId,
        spaceId,
        active: true,
      },
      select: { role: true },
    });
    if (!collaborator) {
      throw new ForbiddenException(`can't find collaborator`);
    }
    return collaborator.role as SpaceRole;
  }

  private async getPermissionBySpaceId(spaceId: string) {
    const role = await this.getRoleBySpaceId(spaceId);
    return getPermissions(RoleType.Space, role);
  }

  private async getPermissionByDocumentId(documentId: string) {
    const spaceId = (await this.getUpperIdByDocumentId(documentId)).spaceId;
    return this.getPermissionBySpaceId(spaceId);
  }

  async getUpperIdByDocumentId(
    documentId: string,
  ): Promise<{ spaceId: string }> {
    const space = await this.prismaService.txClient().document.findFirst({
      where: {
        id: documentId,
        active: true,
      },
      select: {
        spaceId: true,
      },
    });
    const spaceId = space?.spaceId;
    if (!spaceId) {
      throw new NotFoundException(`Invalid documentId: ${documentId}`);
    }
    return { spaceId };
  }

  async getPermissionsByResourceId(resourceId: string) {
    if (resourceId.startsWith(IdPrefix.Space)) {
      return await this.getPermissionBySpaceId(resourceId);
    } else if (resourceId.startsWith(IdPrefix.Document)) {
      return await this.getPermissionByDocumentId(resourceId);
    } else {
      throw new ForbiddenException('request path is not valid');
    }
  }

  async getAccessToken(accessTokenId: string) {
    return null as any;
  }

  async getPermissionsByAccessToken(resourceId: string, accessTokenId: string) {
    return [];
  }

  async getPermissions(resourceId: string, accessTokenId?: string) {
    const userPermissions = await this.getPermissionsByResourceId(resourceId);

    if (accessTokenId) {
      const accessTokenPermission = await this.getPermissionsByAccessToken(
        resourceId,
        accessTokenId
      );
      return intersection(userPermissions, accessTokenPermission);
    }
    return userPermissions;
  }


  async validPermissions(
    resourceId: string,
    permissions: PermissionAction[],
    accessTokenId?: string,
  ) {
    const ownPermissions = await this.getPermissions(resourceId, accessTokenId);
    if (permissions.every((permission) => ownPermissions.includes(permission))) {
      return ownPermissions;
    }
    throw new ForbiddenException(
      `not allowed to operate ${permissions.join(', ')} on ${resourceId}`
    );
  }
}
