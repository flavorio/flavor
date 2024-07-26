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

  public async createDocument(name: string, spaceId: string, doc: any) {
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
    const document = await this.prismaService.txClient().document.findUnique({
      where: {
        id,
      },
    });

    const records = await this.prismaService.txClient().record.findMany({
      where: {
        documentId: id,
        active: true,
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

  public async updateDocumentRecords(id: string, updates: UpdatesRo[]) {
    const userId = this.cls.get('user.id');

    await this.prismaService.$tx(async (prisma) => {
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const { added, removed, updated } = update.changes;

        const createOrUpdateRecord = async (record: any) => {
          await prisma.record.upsert({
            where: {
              documentId_recordId: {
                documentId: id,
                recordId: record.id,
              },
            },
            update: {
              active: true,
              data: record,
            },
            create: {
              documentId: id,
              recordId: record.id,
              type: record.typeName,
              data: record,
              createdBy: userId,
            },
          });
        };

        const deleteRecord = async (record: any) => {
          await prisma.record.update({
            where: {
              documentId_recordId: {
                documentId: id,
                recordId: record.id,
              },
            },
            data: {
              active: false,
            },
          });
        };

        for (const [_, record] of Object.entries(added)) {
          await createOrUpdateRecord(record);
        }

        for (const [_, record] of Object.entries(removed)) {
          await deleteRecord(record);
        }

        for (const [_, change] of Object.entries(updated)) {
          await createOrUpdateRecord(change[1]);
        }
      }
    });
  }
}
