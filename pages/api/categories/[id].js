// pages/api/categories/[id].js
import db from '../../../lib/db';
import { requireRole } from '../../../lib/authGuard';
import { logAudit } from '../../../lib/audit';

export default async function handler(req, res) {
  const session = await requireRole(req, res, ['admin']);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { name, slug } = req.body;
    const [prevRows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (prevRows.length === 0) return res.status(404).json({ error: 'دسته‌بندی پیدا نشد' });
    const prev = prevRows[0];

    const changes = {};
    const fields = [];
    const params = [];

    if (name && name !== prev.name) { fields.push('name = ?'); params.push(name); changes.name = { from: prev.name, to: name }; }
    if (slug && slug !== prev.slug) { fields.push('slug = ?'); params.push(slug); changes.slug = { from: prev.slug, to: slug }; }

    if (fields.length === 0) return res.status(200).json({ message: 'بدون تغییر' });

    params.push(id);
    await db.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, params);
    await logAudit({ userId: session.user.id, entity: 'category', entityId: Number(id), action: 'update', changes });

    return res.status(200).json({ message: 'به‌روزرسانی شد' });
  }

  if (req.method === 'DELETE') {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    await logAudit({ userId: session.user.id, entity: 'category', entityId: Number(id), action: 'delete', changes: {} });
    return res.status(200).json({ message: 'حذف شد' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}