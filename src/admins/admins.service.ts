import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdminDto) {
    const existing = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already used');

    const hashed = await bcrypt.hash(dto.password, 10);

    return this.prisma.admin.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        birthDate: new Date(dto.birthDate),
        gender: dto.gender,
        password: hashed,
      },
    });
  }

  findAll() {
    return this.prisma.admin.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        gender: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: number, dto: UpdateAdminDto) {
    const data: any = { ...dto };
    if (dto.birthDate) {
      data.birthDate = new Date(dto.birthDate);
    }
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.admin.delete({ where: { id } });
  }
}
