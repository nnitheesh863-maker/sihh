import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../config/database';

// ─── User Repository ──────────────────────────────────────────────────────────

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async create(data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role?: 'FARMER' | 'PROCUREMENT_OFFICER' | 'ADMIN';
    village?: string;
    district?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      phone: string;
      village: string;
      district: string;
      isActive: boolean;
    }>
  ) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async findAll(skip = 0, take = 20) {
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total };
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { token } });
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
