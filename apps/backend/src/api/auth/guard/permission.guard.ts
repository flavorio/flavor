import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { IClsStore } from 'src/types/cls';
import { PermissionService } from '../permission.service';
import { IResourceMeta, RESOURCE_META } from '../decorator/resource-meta.decorator';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { IS_DISABLED_PERMISSION } from '../decorator/disabled-permission.decorator';
import { PermissionAction } from '@flavor/core';
import { PERMISSIONS_KEY } from '../decorator/permissions.decorator';
import { IS_TOKEN_ACCESS } from '../decorator/token.decorator';

@Injectable()
export class PermissionGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<IClsStore>,
    private readonly permissionService: PermissionService,
  ) {

  }

  private getResourceId(context: ExecutionContext): string | undefined {
    const resourceMeta = this.reflector.getAllAndOverride<IResourceMeta | undefined>(
      RESOURCE_META,
      [context.getHandler(), context.getClass()]
    );
    const req = context.switchToHttp().getRequest();

    if (resourceMeta) {
      const { type, position } = resourceMeta;
      return req?.[position]?.[type];
    }
    return req.params.documentId || req.params.spaceId;
  }

  async canActivate(context: ExecutionContext) {
    // public check
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // disabled check
    const isDisabledPermission = this.reflector.getAllAndOverride<boolean>(IS_DISABLED_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isDisabledPermission) {
      return true;
    }

    return this.permissionCheck(context);
  }

  protected async permissionCheck(context: ExecutionContext) {
    const permissions = this.reflector.getAllAndOverride<PermissionAction[] | undefined>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    const accessTokenId = this.cls.get('accessTokenId');
    if (accessTokenId && !permissions?.length) {
      // Pre-checking of tokens
      // The token can only access interfaces that are restricted by permissions or have a token access indicator.
      return this.reflector.getAllAndOverride<boolean>(IS_TOKEN_ACCESS, [
        context.getHandler(),
        context.getClass(),
      ]);
    }

    if (!permissions?.length) {
      return true;
    }
    // space create permission check
    if (permissions?.includes('space|create')) {
      return await this.permissionCreateSpace();
    }
    // resource permission check
    return await this.resourcePermission(this.getResourceId(context), permissions);
  }

  private async permissionCreateSpace() {
    const accessTokenId = this.cls.get('accessTokenId');
    if (accessTokenId) {
      const { scopes } = await this.permissionService.getAccessToken(accessTokenId);
      return scopes.includes('space|create');
    }
    return true;
  }

  protected async resourcePermission(
    resourceId: string | undefined,
    permissions: PermissionAction[]
  ) {
    if (!resourceId) {
      throw new ForbiddenException('permission check ID does not exist');
    }
    const accessTokenId = this.cls.get('accessTokenId');
    const ownPermissions = await this.permissionService.validPermissions(
      resourceId,
      permissions,
      accessTokenId
    );
    this.cls.set('permissions', ownPermissions);
    return true;
  }

}
