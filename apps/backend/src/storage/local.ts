import { createReadStream, createWriteStream } from 'fs';
import { BadRequestException, Injectable } from "@nestjs/common";
import * as fse from 'fs-extra';
import { FileUtils, join } from "src/utils";
import { resolve } from 'node:path';
import os from 'node:os';
import { Encryptor } from "src/utils/encryptor";
import { ILocalFileUpload, IObjectMeta, IPresignParams, IRespHeaders } from "./types";
import { IStorageConfig, StorageConfig } from "src/config/storage.config";
import { CacheService } from "src/cache/cache.service";
import StorageAdapter from "./adapter";
import { getRandomString } from "@flavor/core";
import { second } from "src/utils/second";
import sharp from "sharp";
import { Readable } from "stream";

interface ITokenEncryptor {
  expiresDate: number;
  respHeaders?: IRespHeaders;
}


@Injectable()
export class LocalStorage implements StorageAdapter {
  path: string;
  storageDir: string;
  temporaryDir = resolve(os.tmpdir(), '.temporary');
  expireTokenEncryptor: Encryptor<ITokenEncryptor>;
  readPath = '/api/attachment/read';

  constructor(
    @StorageConfig() readonly config: IStorageConfig,
    private readonly cacheService: CacheService
  ) {
    this.expireTokenEncryptor = new Encryptor(this.config.encryption);
    this.path = this.config.local.path;
    this.storageDir = resolve(process.cwd(), this.path);

    fse.ensureDirSync(this.temporaryDir);
    fse.ensureDirSync(this.storageDir);
  }
  async getObjectMeta(bucket: string, path: string, token: string): Promise<IObjectMeta> {
    throw new Error("Method not implemented.");
  }
  getPreviewUrl(bucket: string, path: string, expiresIn?: number | undefined, respHeaders?: { [key: string]: any; } | undefined): Promise<string> {
    throw new Error("Method not implemented.");
  }
  uploadFile(bucket: string, path: string, stream: Buffer | Readable, metadata?: Record<string, unknown> | undefined): Promise<{ hash: string; url: string; }> {
    throw new Error("Method not implemented.");
  }

  private getUploadUrl(token: string) {
    return `/api/attachment/upload/${token}`;
  }

  async uploadFileWidthPath(
    bucket: string,
    path: string,
    filePath: string,
    _metadata: Record<string, unknown>
  ) {
    const hash = await FileUtils.getHash(filePath);
    await this.save(filePath, join(bucket, path));
    return {
      hash,
      url: join(this.readPath, bucket, path),
    };
  }

  async save(filePath: string, rename: string) {
    const distPath = resolve(this.storageDir);
    const newFilePath = resolve(distPath, rename);
    await fse.copy(filePath, newFilePath);
    await fse.remove(filePath);
    return join(this.path, rename);
  }

  read(path: string) {
    return createReadStream(resolve(this.storageDir, path));
  }


  parsePath(path: string) {
    const parts = path.split('/');
    return {
      bucket: parts[0],
      token: parts[parts.length - 1],
    };
  }

  async presigned(_bucket: string, dir: string, params: IPresignParams) {
    const { contentType, contentLength, hash } = params;
    const token = getRandomString(12);
    const filename = hash ?? token;
    const expiresIn = params?.expiresIn ?? second(this.config.tokenExpireIn);
    await this.cacheService.set(
      `attachment:local-signature:${token}`,
      {
        expiresDate: Math.floor(Date.now() / 1000) + expiresIn,
        contentLength,
        contentType,
      },
      expiresIn
    );

    const path = join(dir, filename);
    return {
      token,
      path,
      url: this.getUploadUrl(token),
      uploadMethod: 'PUT',
      requestHeaders: {
        'Content-Type': contentType,
        'Content-Length': contentLength,
      },
    };
  }


  async validateToken(token: string, file: ILocalFileUpload) {
    const validateMeta = await this.cacheService.get(`attachment:local-signature:${token}`);
    if (!validateMeta) {
      throw new BadRequestException('Invalid token');
    }
    const { expiresDate, contentLength, contentType } = validateMeta;

    const { size, mimetype } = file;
    if (Math.floor(Date.now() / 1000) > expiresDate) {
      throw new BadRequestException('Token has expired');
    }
    if (contentLength && contentLength !== size) {
      throw new BadRequestException('Size mismatch');
    }
    if (mimetype && mimetype !== contentType) {
      throw new BadRequestException(`Not allow upload ${mimetype} file`);
    }
  }

  getLastModifiedTime(path: string) {
    const url = resolve(this.storageDir, path);
    if (!fse.existsSync(url)) {
      return;
    }
    return fse.statSync(url).mtimeMs;
  }

  async getFileMeta(path: string) {
    const info = await sharp(path).metadata();
    return {
      width: info.width,
      height: info.height,
    };
  }

  private getUrl(bucket: string, path: string, params: ITokenEncryptor) {
    const token = this.expireTokenEncryptor.encrypt(params);
    return `${join(this.readPath, bucket, path)}?token=${token}`;
  }

  verifyReadToken(token: string) {
    try {
      const { expiresDate, respHeaders } = this.expireTokenEncryptor.decrypt(token);
      if (expiresDate > 0 && Math.floor(Date.now() / 1000) > expiresDate) {
        throw new BadRequestException('Token has expired');
      }
      return { respHeaders };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
}
