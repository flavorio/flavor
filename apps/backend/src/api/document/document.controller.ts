import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { ResourceMeta } from '../auth/decorator/resource-meta.decorator';
import { CreateDocumentRo, createDocumentSchema } from '@flavor/core';
import { ZodValidationPipe } from 'src/zod.validation.pipe';

@Controller('api/document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @HttpCode(HttpStatus.OK)
  @Post('createDocument')
  @Permissions('document|create')
  @ResourceMeta('spaceId', 'body')
  public async createDocument(
    @Body(new ZodValidationPipe(createDocumentSchema)) body: CreateDocumentRo,
  ): Promise<any> {
    const { name, spaceId, doc } = body;
    return await this.documentService.createDocument(name, spaceId, doc);
  }
}
