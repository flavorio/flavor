import type { ClsStore } from 'nestjs-cls';
import { Prisma } from '@prisma/client';
import { PermissionAction } from '@flavor/core';

export interface IClsStore extends ClsStore {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessTokenId?: string;
  entry?: {
    type: string;
    id: string;
  };
  tx: {
    client?: Prisma.TransactionClient;
    timeStr?: string;
    id?: string;
  };

  cookie?: string;
  permissions: PermissionAction[];
}
