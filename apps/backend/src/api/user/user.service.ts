import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  generateUserId,
  generateAccountId,
  generateSpaceId,
  SpaceRole,
} from '@flavor/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { IClsStore } from 'src/types/cls';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
  ) {}

  async getUserById(id: string) {
    const userRaw = await this.prismaService
      .txClient()
      .user.findUnique({ where: { id, active: true } });

    return (
      userRaw && {
        ...userRaw,
      }
    );
  }

  async getUserByEmail(email: string) {
    return await this.prismaService.txClient().user.findUnique({
      where: { email, active: true },
      include: { accounts: true },
    });
  }

  async createUser(user: any, account?: any) {
    user = {
      ...user,
      id: user.id ?? generateUserId(),
    };

    // if (!user?.avatar) {
    //   const avatar = await this.generateDefaultAvatar(user.id!);
    //   user = {
    //     ...user,
    //     avatar,
    //   };
    // }

    const newUser = await this.prismaService.txClient().user.create({
      data: {
        ...user,
        name: user.name ?? user.email.split('@')[0],
      },
    });

    const { id, name } = newUser;
    if (account) {
      await this.prismaService.txClient().account.create({
        data: { id: generateAccountId(), ...account, userId: id },
      });
    }

    await this.cls.runWith(this.cls.get(), async () => {
      this.cls.set('user.id', id);
      await this.createSpaceBySignUp(`${name}'s space`);
    });

    return newUser;
  }

  // private async generateDefaultAvatar(id: string) {
  //   const path = join(StorageAdapter.getDir(UploadType.Avatar), id);
  //   const bucket = StorageAdapter.getBucket(UploadType.Avatar);

  //   const svgSize = [410, 410];
  //   const svgString = minidenticon(id);
  //   const svgObject = sharp(Buffer.from(svgString))
  //     .resize(svgSize[0], svgSize[1])
  //     .flatten({ background: '#f0f0f0' })
  //     .png({ quality: 90 });
  //   const mimetype = 'image/png';
  //   const { size } = await svgObject.metadata();
  //   const svgBuffer = await svgObject.toBuffer();

  //   const { url, hash } = await this.storageAdapter.uploadFile(bucket, path, svgBuffer, {
  //     // eslint-disable-next-line @typescript-eslint/naming-convention
  //     'Content-Type': mimetype,
  //   });

  //   await this.mountAttachment(id, {
  //     bucket: bucket,
  //     hash: hash,
  //     size: size,
  //     mimetype: mimetype,
  //     token: id,
  //     path: path,
  //     width: svgSize[0],
  //     height: svgSize[1],
  //   });

  //   return url;
  // }

  async createSpaceBySignUp(name: string) {
    const spaceId = generateSpaceId();
    const userId = this.cls.get('user.id');
    const space = await this.prismaService.space.create({
      select: {
        id: true,
        name: true,
      },
      data: {
        id: spaceId,
        name,
        createdBy: userId,
      },
    });

    await this.prismaService.spaceMember.create({
      data: {
        spaceId,
        userId,
        createdBy: userId,
        role: SpaceRole.Owner,
      },
    });
    return space;
  }


  async refreshLastSignTime(userId: string) {
    await this.prismaService.txClient().user.update({
      where: { id: userId, active: true },
      data: { lastSignAt: new Date().toISOString() },
    });
  }
}
