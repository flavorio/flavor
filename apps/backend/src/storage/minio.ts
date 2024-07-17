// import { Injectable } from "@nestjs/common";
// import * as minio from 'minio';
// import StorageAdapter from "./adapter";
// import { IStorageConfig, StorageConfig } from "src/config/storage.config";
// import { IPresignParams, IPresignRes } from "./types";
// import { getRandomString } from "@flavor/core";
// import { join } from "lodash";

// @Injectable()
// export class MinioStorage implements StorageAdapter {
//   minioClient: minio.Client;

//   constructor(@StorageConfig() readonly config: IStorageConfig) {
//     const { endPoint, port, useSSL, accessKey, secretKey } = this.config.minio;
//     this.minioClient = new minio.Client({
//       endPoint: endPoint!,
//       port: port!,
//       useSSL: useSSL!,
//       accessKey: accessKey!,
//       secretKey: secretKey!,
//     });
//   }

//   async presigned(
//     bucket: string,
//     dir: string,
//     presignedParams: IPresignParams
//   ): Promise<IPresignRes> {
//     const { tokenExpireIn, uploadMethod } = this.config;
//     const { expiresIn, contentLength, contentType, hash } = presignedParams;
//     const token = getRandomString(12);
//     const filename = hash ?? token;
//     const path = join(dir, filename);
//     const requestHeaders = {
//       'Content-Type': contentType,
//       'Content-Length': contentLength,
//     };
//     try {
//       const url = replaceStorageUrl(
//         await this.minioClient.presignedUrl(
//           uploadMethod,
//           bucket,
//           path,
//           expiresIn ?? second(tokenExpireIn),
//           requestHeaders
//         )
//       );
//       return {
//         url,
//         path,
//         token,
//         uploadMethod,
//         requestHeaders,
//       };
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (e: any) {
//       throw new BadRequestException(`Minio presigned error${e?.message ? `: ${e.message}` : ''}`);
//     }
//   }

// }
