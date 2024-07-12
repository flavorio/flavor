import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentRequest } from './document.dto';

@Controller('api/document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @HttpCode(HttpStatus.OK)
  @Post('createDocument')
  public async createDocument(
    @Body() body: CreateDocumentRequest,
  ): Promise<any> {
    const { name, spaceId, doc } = body;
    return await this.documentService.createDocument(name, spaceId, doc);
  }

}
