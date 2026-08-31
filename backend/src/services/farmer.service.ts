import { UserRepository } from '../repositories/user.repository';
import { AnalysisRepository } from '../repositories/analysis.repository';
import { NotFoundError } from '../utils/errors';
import { UpdateProfileInput } from '../validators/schemas';

// ─── Farmer Service ───────────────────────────────────────────────────────────

export class FarmerService {
  private userRepo: UserRepository;
  private analysisRepo: AnalysisRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.analysisRepo = new AnalysisRepository();
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    const updated = await this.userRepo.update(userId, data);
    const { password: _, ...safeUser } = updated;
    return safeUser;
  }
}
