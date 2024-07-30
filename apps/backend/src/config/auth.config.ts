import { Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  session: {
    secret:
      process.env.BACKEND_SESSION_SECRET ??
      '3RTgXVkvcl9pkN21UNwzs6p5KrOONGJla2iVA6LhwDdU16NjzQRMskWukStixcO6',
    expiresIn: process.env.BACKEND_SESSION_EXPIRES_IN ?? '7d',
  },
}));

export const AuthConfig = () => Inject(authConfig.KEY);

export type IAuthConfig = ConfigType<typeof authConfig>;
