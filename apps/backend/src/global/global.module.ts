import { Global, MiddlewareConsumer, NestModule, Module, DynamicModule, ModuleMetadata } from "@nestjs/common";
import { APP_GUARD } from '@nestjs/core';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { ConfigModule } from '../config/config.module';
import { CacheModule } from "../cache/cache.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthGuard } from "src/api/auth/guard/auth.guard";
const globalModules = {
  imports: [
    ConfigModule.register(),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        // generateId: true,
        // idGenerator: (req: Request) => {
        //   const existingID = req.headers[X_REQUEST_ID] as string;
        //   if (existingID) return existingID;

        //   const span = trace.getSpan(context.active());
        //   if (!span) return nanoid();

        //   const { traceId } = span.spanContext();
        //   return traceId;
        // },
      },
    }),
    CacheModule.register({global: true}),
    PrismaModule
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],

  exports: [

  ]
}

@Global()
@Module(globalModules)
export class GlobalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware)
  }

  static register(moduleMetadata: ModuleMetadata): DynamicModule {
    return {
      module: GlobalModule,
      global: true,
      imports: [...globalModules.imports, ...(moduleMetadata.imports || [])],
      providers: [...globalModules.providers, ...(moduleMetadata.providers || [])],
      exports: [...globalModules.exports, ...(moduleMetadata.exports || [])],
    };
  }
}
