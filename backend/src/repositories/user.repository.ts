import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../config/database';
import bcrypt from 'bcryptjs';

// ─── Pre-seeded In-Memory Store for Resilient Dev/Fallback ───────────────────
const localUsers: Map<string, any> = new Map();
const localTokens: Map<string, any> = new Map();

// Initialize default demo users in memory
const defaultPasswordHash = bcrypt.hashSync('Password123', 8);
const demoAccounts = [
  { id: 'usr_admin', name: 'System Admin', email: 'admin@gmail.com', phone: '9000000000', password: defaultPasswordHash, role: 'ADMIN', village: 'Nashik', district: 'Nashik', isActive: true, createdAt: new Date() },
  { id: 'usr_admin_sih', name: 'System Admin', email: 'admin@sih.gov.in', phone: '9000000001', password: defaultPasswordHash, role: 'ADMIN', village: 'Nashik', district: 'Nashik', isActive: true, createdAt: new Date() },
  { id: 'usr_officer_sih', name: 'Vikram Deshmukh (APMC)', email: 'officer@sih.gov.in', phone: '9876543211', password: defaultPasswordHash, role: 'PROCUREMENT_OFFICER', district: 'Pune', isActive: true, createdAt: new Date() },
  { id: 'usr_farmer_sih', name: 'Sanjay Kumar (Farmer)', email: 'farmer@sih.gov.in', phone: '9876543210', password: defaultPasswordHash, role: 'FARMER', village: 'Lasalgaon', district: 'Nashik', isActive: true, createdAt: new Date() },
  { id: 'usr_farmer_example', name: 'Sanjay Kumar', email: 'farmer@example.com', phone: '9876543219', password: defaultPasswordHash, role: 'FARMER', village: 'Lasalgaon', district: 'Nashik', isActive: true, createdAt: new Date() },
];

demoAccounts.forEach(u => localUsers.set(u.email.toLowerCase(), u));

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async findById(id: string) {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch {
      for (const u of localUsers.values()) {
        if (u.id === id) return u;
      }
      return null;
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch {
      return localUsers.get(email.toLowerCase()) || null;
    }
  }

  async findByPhone(phone: string) {
    try {
      return await this.prisma.user.findUnique({ where: { phone } });
    } catch {
      for (const u of localUsers.values()) {
        if (u.phone === phone) return u;
      }
      return null;
    }
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
    try {
      return await this.prisma.user.create({ data });
    } catch {
      const newUser = {
        id: `usr_${Date.now()}`,
        ...data,
        role: data.role || 'FARMER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localUsers.set(data.email.toLowerCase(), newUser);
      return newUser as any;
    }
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
    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch {
      for (const u of localUsers.values()) {
        if (u.id === id) {
          Object.assign(u, data);
          return u;
        }
      }
      return null;
    }
  }

  async findAll(skip = 0, take = 20) {
    try {
      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count(),
      ]);
      return { users, total };
    } catch {
      const all = Array.from(localUsers.values());
      return { users: all.slice(skip, skip + take), total: all.length };
    }
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    try {
      await this.prisma.refreshToken.create({
        data: { userId, token, expiresAt },
      });
    } catch {
      localTokens.set(token, { userId, token, expiresAt });
    }
  }

  async findRefreshToken(token: string) {
    try {
      return await this.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });
    } catch {
      const rec = localTokens.get(token);
      if (!rec) return null;
      let user = null;
      for (const u of localUsers.values()) {
        if (u.id === rec.userId) { user = u; break; }
      }
      return { ...rec, user };
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    try {
      await this.prisma.refreshToken.delete({ where: { token } });
    } catch {
      localTokens.delete(token);
    }
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    try {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    } catch {
      for (const [key, val] of localTokens.entries()) {
        if (val.userId === userId) localTokens.delete(key);
      }
    }
  }
}

