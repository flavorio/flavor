import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import isPortReachable from 'is-port-reachable';
import { ConfigService } from '@nestjs/config';
import { NextService } from './next/next.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

const host = 'localhost';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe());

  const port = await getAvailablePort(
    configService.get<string>('PORT') as string,
  );
  process.env.PORT = port.toString();

  process.env.NODE_ENV === 'production'
    ? await app.listen(port)
    : await app.listen(port, 'localhost');

  // await app.listen(port);
}
bootstrap();

async function getAvailablePort(dPort: number | string): Promise<number> {
  let port = Number(dPort);
  while (await isPortReachable(port, { host })) {
    console.log(`> Fail on http://${host}:${port} Trying on ${port + 1}`);
    port++;
  }
  return port;
}
