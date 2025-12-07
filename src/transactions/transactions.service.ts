import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Transaction items required');
    }

    return this.prisma.$transaction(async (tx) => {
      // cek stok jika type OUT
      if (dto.type === 'OUT') {
        for (const item of dto.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) {
            throw new BadRequestException(
              `Product ${item.productId} not found`,
            );
          }
          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Stock for product ${product.name} is not enough`,
            );
          }
        }
      }

      // buat transaksi
      const transaction = await tx.transaction.create({
        data: {
          type: dto.type as TransactionType,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // update stok produk
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data:
            dto.type === 'IN'
              ? { stock: { increment: item.quantity } }
              : { stock: { decrement: item.quantity } },
        });
      }

      return transaction;
    });
  }

  findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }
}
