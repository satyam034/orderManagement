import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';
import { pool } from '../db';

dotenv.config();

// Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
});

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private OTP_TTL = 120; // seconds

  // Generate and store OTP in Redis
  async sendOtp(mobile: string): Promise<{ message: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${mobile}`, otp, 'EX', this.OTP_TTL);

    this.logger.log(`OTP for ${mobile}: ${otp} (valid ${this.OTP_TTL}s)`);

    return { message: 'OTP generated and logged on server console (simulate SMS)' };
  }

  // Verify OTP and issue JWT
  async verifyOtp(
    mobile: string,
    otp: string
  ): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
    const key = `otp:${mobile}`;
    const stored = await redis.get(key);

    if (!stored || stored !== otp) {
      return { ok: false, message: 'Invalid OTP' };
    }

    // OTP correct — delete it
    await redis.del(key);

    // Ensure user exists in DB (create if not)
    const conn = await pool.getConnection();
    try {
      const [rows]: any = await conn.query('SELECT id FROM users WHERE mobile = ?', [mobile]);
      let userId: number;

      if (rows.length === 0) {
        const [res]: any = await conn.query('INSERT INTO users (mobile) VALUES (?)', [mobile]);
        userId = res.insertId;
      } else {
        userId = rows[0].id;
      }

      // Issue JWT
      const payload = { userId, mobile };
      const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      };
      const secret = process.env.JWT_SECRET ?? 'secret';
      const token = jwt.sign(payload, secret, options);

      return { ok: true, token };
    } finally {
      conn.release();
    }
  }

  // Decode/verify JWT (used by middleware)
  verifyToken(token: string): { ok: true; decoded: any } | { ok: false; error: string } {
    try {
      const secret = process.env.JWT_SECRET ?? 'secret';
      const decoded = jwt.verify(token, secret);
      return { ok: true, decoded };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return { ok: false, error: e.message };
      }
      return { ok: false, error: 'Unknown error' };
    }
  }
}
