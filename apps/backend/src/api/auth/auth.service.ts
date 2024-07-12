import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { generateUserId, getRandomString } from '@flavor/core';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  private async encodePassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return { salt, hashPassword };
  }

  async signup(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user && (user.password !== null || user.accounts.length > 0)) {
      throw new HttpException(`User ${email} is already registered`, HttpStatus.BAD_REQUEST);
    }
    const { salt, hashPassword } = await this.encodePassword(password);
    return await this.prismaService.$tx(async () => {
      if (user) {
        return await this.prismaService.user.update({
          where: { id: user.id, active: true },
          data: {
            salt,
            password: hashPassword,
            lastSignAt: new Date().toISOString(),
          },
        });
      }
      return await this.userService.createUser({
        id: generateUserId(),
        name: email.split('@')[0],
        email,
        salt,
        password: hashPassword,
        lastSignAt: new Date().toISOString(),
      });
    });
  }

  async validateUserByEmail(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || (user.accounts.length === 0 && user.password == null)) {
      throw new BadRequestException(`${email} not registered`);
    }

    if (!user.password) {
      throw new BadRequestException('Password is not set');
    }

    const { password, salt, ...result } = user;
    return (await this.comparePassword(pass, password, salt)) ? { ...result, password } : null;
  }

  private async comparePassword(
    password: string,
    hashPassword: string | null,
    salt: string | null
  ) {
    const _hashPassword = await bcrypt.hash(password || '', salt || '');
    return _hashPassword === hashPassword;
  }
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
}
