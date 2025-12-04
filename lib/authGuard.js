// lib/authGuard.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth].js';

export async function requireSession(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}

export async function requireRole(req, res, roles = ['admin']) {
  const session = await requireSession(req, res);
  if (!session) return null;
  if (!roles.includes(session.user.role)) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return session;
}