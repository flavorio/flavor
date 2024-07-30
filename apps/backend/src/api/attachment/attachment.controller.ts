import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '../auth/decorator/public.decorator';
import { AttachmentService } from './attachment.service';

@Controller('api/attachment')
@Public()
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get('/read/:path(*)')
  async read(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Param('path') path: string,
    @Query('token') token: string,
    @Query('filename') filename?: string,
  ) {
    const hasCache = this.attachmentService.localFileConditionalCaching(
      path,
      req.headers,
      res,
    );
    if (hasCache) {
      res.status(304);
      return;
    }
    const { fileStream, headers } = await this.attachmentService.readLocalFile(
      path,
      token,
      filename,
    );
    res.set(headers);
    return new StreamableFile(fileStream);
  }
}
