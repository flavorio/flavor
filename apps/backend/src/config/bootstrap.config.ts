/* eslint-disable @typescript-eslint/naming-convention */
import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';

export const nextJsConfig = registerAs('nextJs', () => ({
  dir: process.env.NEXTJS_DIR ?? '../frontend-nextjs',
}));

export type INextJsConfig = ConfigType<typeof nextJsConfig>;
export const bootstrapConfigs = [nextJsConfig];
