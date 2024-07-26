import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { loggerConfig } from './logger.config';
import { authConfig } from './auth.config';
import { cacheConfig } from './cache.config';
import { storageConfig } from './storage.config';
import { mailConfig } from './mail.config';

const configurations = [
  loggerConfig,
  mailConfig,
  authConfig,
  cacheConfig,
  storageConfig,
];

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return BaseConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: configurations,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    });
  }
}
