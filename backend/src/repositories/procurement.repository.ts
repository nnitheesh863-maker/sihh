import { getPrismaClient } from '../config/database';

// ─── Procurement Repository ───────────────────────────────────────────────────

export class ProcurementRepository {
  private prisma = getPrismaClient();

  async findAll(skip = 0, take = 50) {
    const [centers, total] = await this.prisma.$transaction([
      this.prisma.procurementCenter.findMany({
        skip,
        take,
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.procurementCenter.count({ where: { isActive: true } }),
    ]);
    return { centers, total };
  }

  async findById(id: string) {
    return this.prisma.procurementCenter.findUnique({ where: { id } });
  }

  async findByDistrict(district: string) {
    return this.prisma.procurementCenter.findMany({
      where: { district, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: {
    name: string;
    district: string;
    latitude: number;
    longitude: number;
  }) {
    return this.prisma.procurementCenter.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      district: string;
      latitude: number;
      longitude: number;
      isActive: boolean;
    }>
  ) {
    return this.prisma.procurementCenter.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.procurementCenter.delete({ where: { id } });
  }
}
