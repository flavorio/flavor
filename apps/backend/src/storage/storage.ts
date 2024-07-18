import { Inject, Provider } from "@nestjs/common";
import { CacheService } from "src/cache/cache.service";
import { IStorageConfig, storageConfig } from "src/config/storage.config";
import { LocalStorage } from "./local";
import { MinioStorage } from "./minio";

const StorageAdapterProvider = Symbol.for('ObjectStorage');

export const InjectStorageAdapter = () => Inject(StorageAdapterProvider);

export const storageAdapterProvider: Provider = {
  provide: StorageAdapterProvider,
  useFactory: (config: IStorageConfig, cacheService: CacheService) => {
    switch (config.provider) {
      case 'local':
        return new LocalStorage(config, cacheService);
      case 'minio':
        return new MinioStorage(config);
      default:
        throw new Error('Invalid storage provider');
    }
  },
  inject: [storageConfig.KEY, CacheService],
};
