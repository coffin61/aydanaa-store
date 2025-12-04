// pages/api/users/[id].js
import db from '../../../lib/db';
import bcrypt from 'bcrypt';
import { requireRole } from '../../../lib/authGuard';
import { logAudit } from '../../../lib/audit';

export default async function handler(req, res) {
  const session = await requireRole(req, res, ['admin']);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { name, email, role, password } = req.body;
    const [prevRows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (prevRows.length === 0) return res.status(404).json({ error: 'کاربر پیدا نشد' });
    const prev = prevRows[0];

    const fields = [];
    const params = [];
    const changes = {};

    if (name && name !== prev.name) { fields.push('name = ?'); params.push(name); changes.name = { from: prev.name, to: name }; }
    if (email && email !== prev.email) { fields.push('email = ?'); params.push(email); changes.email = { from: prev.email, to: email }; }
    if (role && role !== prev.role) { fields.push('role = ?'); params.push(role); changes.role = { from: prev.role, to: role }; }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push('password = ?'); params.push(hashed);
      changes.password = { from: '***', to: '***' };
    }

    if (fields.length === 0) return res.status(200).json({ message: 'بدون تغییر' });

    params.push(id);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);

    await logAudit({ userId: session.user.id, entity: 'user', entityId: Number(id), action: 'update', changes });

    return res.status(200).json({ message: 'به‌روزرسانی شد' });
  }

  if (req.method === 'DELETE') {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    await logAudit({ userId: session.user.id, entity: 'user', entityId: Number(id), action: 'delete', changes: {} });
    return res.status(200).json({ message: 'کاربر حذف شد' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}