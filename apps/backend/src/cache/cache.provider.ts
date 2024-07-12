import path from 'path';
import { Logger, Provider } from '@nestjs/common';
import { CacheService } from './cache.service';
import { match } from 'ts-pattern';
import * as fse from 'fs-extra';
import Keyv from 'keyv';
import KeyvSqlite from '@keyv/sqlite';
import KeyvRedis from '@keyv/redis';
import { ICacheConfig, cacheConfig } from '../config/cache.config';

export const CacheProvider: Provider = {
  provide: CacheService,
  inject: [cacheConfig.KEY],
  useFactory: (config: ICacheConfig) => {
    const { provider, sqlite, redis } = config;

    const store = match(provider)
      .with('memory', () => new Map())
      .with('sqlite', () => {
        const uri = sqlite.uri.replace(/^sqlite:\/\//, '');
        fse.ensureFileSync(uri);

        Logger.log(`[Cache Manager File Path]: ${path.resolve(uri)}`);

        return new KeyvSqlite({
          ...sqlite,
          uri,
        });
      })
      .with('redis', () => new KeyvRedis(redis, { useRedisSets: false }))
      .exhaustive();

    const keyv = new Keyv({ namespace: 'teable_cache', store: store });
    keyv.on('error', (error) => {
      error && Logger.error(error, 'Cache Manager Connection Error');
    });

    Logger.log(`[Cache Manager Namespace]: ${keyv.opts.namespace}`);

    return new CacheService(keyv);
  },
};
