import { BadRequestException, Injectable } from "@nestjs/common";
import * as minio from 'minio';
import StorageAdapter from "./adapter";
import { IStorageConfig, StorageConfig } from "src/config/storage.config";
import { IObjectMeta, IPresignParams, IPresignRes } from "./types";
import { getRandomString } from "@flavor/core";
import { Readable } from "stream";

@Injectable()
export class MinioStorage implements StorageAdapter {
  minioClient: minio.Client;

  constructor(@StorageConfig() readonly config: IStorageConfig) {
    const { endPoint, port, useSSL, accessKey, secretKey } = this.config.minio;
    this.minioClient = new minio.Client({
      endPoint: endPoint!,
      port: port!,
      useSSL: useSSL!,
      accessKey: accessKey!,
      secretKey: secretKey!,
    });
  }
  getObjectMeta(bucket: string, path: string, token: string): Promise<IObjectMeta> {
    throw new Error("Method not implemented.");
  }
  getPreviewUrl(bucket: string, path: string, expiresIn?: number | undefined, respHeaders?: { [key: string]: any; } | undefined): Promise<string> {
    throw new Error("Method not implemented.");
  }
  uploadFile(bucket: string, path: string, stream: Readable | Buffer, metadata?: Record<string, unknown> | undefined): Promise<{ hash: string; url: string; }> {
    throw new Error("Method not implemented.");
  }

  async presigned(
    bucket: string,
    dir: string,
    presignedParams: IPresignParams
  ): Promise<IPresignRes> {
    throw new Error("Method not implemented.");
  }

  async uploadFileWidthPath(
    bucket: string,
    path: string,
    filePath: string,
    metadata: Record<string, string | number>
  ) {
    console.log(bucket,path,filePath,metadata);
    const { etag: hash } = await this.minioClient.fPutObject(bucket, path, filePath, metadata);
    return {
      hash,
      url: `/${bucket}/${path}`,
    };
  }

}
