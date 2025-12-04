// pages/api/users/index.js
import db from '../../../lib/db';
import bcrypt from 'bcrypt';
import { requireRole } from '../../../lib/authGuard';
import { logAudit } from '../../../lib/audit';

export default async function handler(req, res) {
  // Admin-only
  const session = await requireRole(req, res, ['admin']);
  if (!session) return;

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT id, name, email, role FROM users ORDER BY id DESC');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { name, email, password, role = 'user' } = req.body;
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(400).json({ error: 'این ایمیل قبلاً ثبت شده است.' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    );

    await logAudit({
      userId: session.user.id,
      entity: 'user',
      entityId: result.insertId,
      action: 'create',
      changes: { name: { to: name }, email: { to: email }, role: { to: role } }
    });

    return res.status(201).json({ id: result.insertId });
  }

  res.status(405).json({ error: 'Method not allowed' });
}