import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';
import { TokenAccess } from '../auth/decorator/token.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { IClsStore } from 'src/types/cls';
import { CacheService } from 'src/cache/cache.service';
import { IStorageConfig, StorageConfig } from 'src/config/storage.config';
import { LocalStorage } from 'src/storage/local';
import type { IncomingHttpHeaders } from 'http';
import type { Request, Response } from 'express';
import StorageAdapter from 'src/storage/adapter';
import { InjectStorageAdapter } from 'src/storage/storage';

@Controller('api/attachment')
@Public()
@TokenAccess()
export class AttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly cacheService: CacheService,
    // private readonly attachmentsStorageService: AttachmentStorageService,
    @StorageConfig() readonly storageConfig: IStorageConfig,
    @InjectStorageAdapter() readonly storageAdapter: StorageAdapter,
  ) {}

  async readLocalFile(path: string, token?: string, filename?: string) {
    const localStorage = this.storageAdapter as LocalStorage;
    let respHeaders: Record<string, string> = {};

    if (!path) {
      throw new HttpException(
        `Could not find attachment: ${token}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { bucket, token: tokenInPath } = localStorage.parsePath(path);
    if (token && !StorageAdapter.isPublicBucket(bucket)) {
      respHeaders = localStorage.verifyReadToken(token).respHeaders ?? {};
    } else {
      const attachment = await this.prismaService
        .txClient()
        .attachment.findUnique({ where: { token: tokenInPath, active: true } });
      if (!attachment) {
        throw new BadRequestException(`Invalid path: ${path}`);
      }
      respHeaders['Content-Type'] = attachment.mimetype;
    }

    const headers: Record<string, string> = respHeaders ?? {};
    if (filename) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }
    const fileStream = localStorage.read(path);

    return { headers, fileStream };
  }

  localFileConditionalCaching(
    path: string,
    reqHeaders: IncomingHttpHeaders,
    res: Response,
  ) {
    const ifModifiedSince = reqHeaders['if-modified-since'];
    const localStorage = this.storageAdapter as LocalStorage;
    const lastModifiedTimestamp = localStorage.getLastModifiedTime(path);
    if (!lastModifiedTimestamp) {
      throw new BadRequestException(`Could not find attachment: ${path}`);
    }
    // Comparison of accuracy in seconds
    if (
      !ifModifiedSince ||
      Math.floor(new Date(ifModifiedSince).getTime() / 1000) <
        Math.floor(lastModifiedTimestamp / 1000)
    ) {
      res.set('Last-Modified', new Date(lastModifiedTimestamp).toUTCString());
      return false;
    }
    return true;
  }
}
