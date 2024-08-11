import { generateDocumentId, UpdatesRo } from '@flavor/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService,
  ) {}

  public async createDocument(name: string, spaceId: string) {
    const userId = this.cls.get('user.id');
    const documentId = generateDocumentId();
    const space = await this.prismaService.txClient().space.findUnique({
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
          createdBy: userId,
        },
      });
    });
    return { documentId };
  }

  public async findDocument(id: string) {
    const document = await this.prismaService.txClient().document.findUnique({
      where: {
        id,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  public async updateDocument(id: string, name: string) {
    const document = await this.prismaService.txClient().document.findUnique({
      where: {
        id,
      },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    await this.prismaService.txClient().document.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  public async updateDocumentSnapshot(id: string, snapshot: any) {
    const document = await this.prismaService.txClient().document.findUnique({
      where: {
        id,
      },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    await this.prismaService.txClient().document.update({
      where: {
        id,
      },
      data: {
        snapshot,
      },
    });
  }
}
