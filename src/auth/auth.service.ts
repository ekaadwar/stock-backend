import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, pass: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) return null;

    const isMatch = await bcrypt.compare(pass, admin.password);
    if (!isMatch) return null;

    return admin;
  }

  async login(dto: LoginDto) {
    const admin = await this.validateAdmin(dto.email, dto.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    };
  }
}
