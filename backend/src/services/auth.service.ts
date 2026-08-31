import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserRepository } from '../repositories/user.repository';
import { ConflictError, AuthenticationError, NotFoundError } from '../utils/errors';
import { TokenPair, AuthenticatedUser } from '../types';
import { RegisterInput, LoginInput } from '../validators/schemas';
import { logger } from '../utils/logger';

// ─── Auth Service ─────────────────────────────────────────────────────────────

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  // ── Register ───────────────────────────────────────────────────────────────

  async register(input: RegisterInput): Promise<{ user: AuthenticatedUser; tokens: TokenPair }> {
    // Check uniqueness
    const existingEmail = await this.userRepo.findByEmail(input.email);
    if (existingEmail) throw new ConflictError('Email already registered');

    const existingPhone = await this.userRepo.findByPhone(input.phone);
    if (existingPhone) throw new ConflictError('Phone number already registered');

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // Create user
    const user = await this.userRepo.create({
      ...input,
      password: hashedPassword,
    });

    logger.info(`User registered: ${user.email}`, { userId: user.id, role: user.role });

    // Generate tokens
    const tokens = this.generateTokenPair({ userId: user.id, role: user.role, email: user.email });
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  // ── Login ──────────────────────────────────────────────────────────────────

  async login(input: LoginInput): Promise<{ user: AuthenticatedUser; tokens: TokenPair }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new AuthenticationError('Invalid email or password');

    if (!user.isActive) throw new AuthenticationError('Account is deactivated');

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) throw new AuthenticationError('Invalid email or password');

    logger.info(`User logged in: ${user.email}`, { userId: user.id });

    const tokens = this.generateTokenPair({ userId: user.id, role: user.role, email: user.email });
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), tokens };
  }

  // ── Refresh ────────────────────────────────────────────────────────────────

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const tokenRecord = await this.userRepo.findRefreshToken(refreshToken);
    if (!tokenRecord) throw new AuthenticationError('Invalid refresh token');

    if (tokenRecord.expiresAt < new Date()) {
      await this.userRepo.deleteRefreshToken(refreshToken);
      throw new AuthenticationError('Refresh token expired');
    }

    try {
      const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string;
        role: string;
        email: string;
      };

      // Rotate refresh token
      await this.userRepo.deleteRefreshToken(refreshToken);
      const tokens = this.generateTokenPair(payload);
      await this.saveRefreshToken(payload.userId, tokens.refreshToken);

      return tokens;
    } catch {
      await this.userRepo.deleteRefreshToken(refreshToken);
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.userRepo.deleteRefreshToken(refreshToken);
    } catch {
      // Token may already be expired/deleted, that's fine
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private generateTokenPair(payload: {
    userId: string;
    role: string;
    email: string;
  }): TokenPair {
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.userRepo.saveRefreshToken(userId, token, expiresAt);
  }

  private sanitizeUser(user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    village?: string | null;
    district?: string | null;
  }): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      village: user.village,
      district: user.district,
    };
  }
}
