import type { Provider } from '@nestjs/common';

export const DB_PROVIDER_SYMBOL = Symbol('DB_PROVIDER');

export const DbProvider: Provider = {
  provide: DB_PROVIDER_SYMBOL,
  useValue: {},
};
