// pages/api/categories/index.js
import db from '../../../lib/db';
import { requireRole } from '../../../lib/authGuard';
import { logAudit } from '../../../lib/audit';

function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

export default async function handler(req, res) {
  const session = await requireRole(req, res, ['admin']);
  if (!session) return;

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id DESC');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'نام دسته‌بندی الزامی است.' });
    }

    const slug = slugify(name);

    // بررسی یونیک بودن
    const [exists] = await db.query('SELECT id FROM categories WHERE slug = ?', [slug]);
    if (exists.length > 0) {
      return res.status(400).json({ error: 'این دسته‌بندی قبلاً ثبت شده است.' });
    }

    const [result] = await db.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    await logAudit({
      userId: session.user.id,
      entity: 'category',
      entityId: result.insertId,
      action: 'create',
      changes: { name: { to: name }, slug: { to: slug } }
    });

    return res.status(201).json({ id: result.insertId, name, slug });
  }

  res.status(405).json({ error: 'Method not allowed' });
}