import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mishpatli-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });
}

export function generateLawyerToken(lawyerId: number): string {
  return jwt.sign({ userId: lawyerId, role: 'LAWYER', lawyerId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number; role: string; lawyerId?: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: string; lawyerId?: number };
  } catch {
    return null;
  }
}
