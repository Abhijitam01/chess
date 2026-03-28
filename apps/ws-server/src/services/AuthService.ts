import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config.js';
import { DatabaseService } from './DatabaseService.js';

const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
});

export interface TokenPayload {
  userId: string;
  username: string;
}

export interface AuthResult {
  token: string;
  userId: string;
  username: string;
  rating: number;
}

export class AuthService {
  private dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  async signup(username: string, password: string): Promise<AuthResult> {
    const parsed = signupSchema.safeParse({ username, password });
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0]?.message ?? 'Invalid input');
    }

    const existing = await this.dbService.findProfileWithCredentials(username);
    if (existing) {
      throw new Error('Username already taken');
    }

    const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
    const profile = await this.dbService.createProfileWithCredentials(username, passwordHash);

    const token = this.issueToken({ userId: profile.id, username: profile.username });
    return { token, userId: profile.id, username: profile.username, rating: profile.rating };
  }

  async signin(username: string, password: string): Promise<AuthResult> {
    const profile = await this.dbService.findProfileWithCredentials(username);
    if (!profile || !profile.credentials) {
      throw new Error('Invalid username or password');
    }

    const valid = await bcrypt.compare(password, profile.credentials.passwordHash);
    if (!valid) {
      throw new Error('Invalid username or password');
    }

    const token = this.issueToken({ userId: profile.id, username: profile.username });
    return { token, userId: profile.id, username: profile.username, rating: profile.rating };
  }

  verifyToken(token: string): TokenPayload {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload & jwt.JwtPayload;
    return { userId: payload.userId, username: payload.username };
  }

  private issueToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  }
}
