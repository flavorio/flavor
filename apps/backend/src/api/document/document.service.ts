import { generateDocumentId } from '@flavor/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService,
  ) {}

  public async createDocument(name: string, spaceId: string, doc: any) {
    const userId = this.cls.get('user.id');
    const documentId = generateDocumentId();
    const space = await this.prismaService.space.findUnique({
      where: {
        id: spaceId,
      },
    });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    await this.prismaService.$tx(async (prisma) => {
      await prisma.document.create({
        data: {
          id: documentId,
          name,
          spaceId,
          schema: doc.schema,
          createdBy: userId,
        },
      });
      for (const [k, v] of Object.entries(doc.store)) {
        await prisma.record.create({
          data: {
            documentId,
            recordId: k,
            type: (v as any).typeName,
            data: v as any,
            createdBy: userId,
          },
        });
      }
    });
    return { documentId };
  }

  public async findDocument(id: string) {
    const document = await this.prismaService.document.findUnique({
      where: {
        id,
      },
    });

    const records = await this.prismaService.record.findMany({
      where: {
        documentId: id,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const store: Record<string, any> = {};
    records.forEach((record) => {
      const data = record.data as any;
      if (data?.id) {
        store[data.id] = data;
      }
    });

    return { schema: document.schema, store };
  }

  public async updateDocument(id: string, name: string) {
    const document = await this.prismaService.document.findUnique({
      where: {
        id,
      },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    await this.prismaService.document.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }
}
