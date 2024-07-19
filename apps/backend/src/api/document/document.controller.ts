import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { ResourceMeta } from '../auth/decorator/resource-meta.decorator';
import {
  CreateDocumentRo,
  FindDocumentRo,
  UpdateDocumentRo,
  createDocumentSchema,
  findDocumentSchema,
  updateDocumentSchema,
} from '@flavor/core';
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

  @HttpCode(HttpStatus.OK)
  @Post('getDocument')
  @Permissions('document|read')
  @ResourceMeta('id', 'body')
  public async getDocument(
    @Body(new ZodValidationPipe(findDocumentSchema)) body: FindDocumentRo,
  ): Promise<any> {
    const { id } = body;
    return await this.documentService.findDocument(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('updateDocument')
  @Permissions('document|update')
  @ResourceMeta('id', 'body')
  public async updateDocument(
    @Body(new ZodValidationPipe(updateDocumentSchema)) body: UpdateDocumentRo,
  ): Promise<any> {
    const { name, id } = body;
    return await this.documentService.updateDocument(id, name);
  }
}
