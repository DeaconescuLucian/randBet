import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: { create: { passwordHash } },
      },
    });
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { password: true },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const ok = await bcrypt.compare(password, user.password.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { sub: user.id.toString(), email: user.email };
    return this.jwt.sign(payload);
  }
}
