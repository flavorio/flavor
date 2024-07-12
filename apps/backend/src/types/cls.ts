import type { ClsStore } from 'nestjs-cls';
import { Prisma } from '@prisma/client';

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
}
