// pages/api/products/index.js
import db from '../../../lib/db';
import { requireRole } from '../../../lib/authGuard';
import { logAudit } from '../../../lib/audit';

export default async function handler(req, res) {
  const session = await requireRole(req, res, ['admin']);
  if (!session) return;

  if (req.method === 'GET') {
    const [rows] = await db.query(`
      SELECT p.id, p.name, p.sku, p.price, p.active, c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC
    `);
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { name, sku, price, category_id, description, image_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (name, sku, price, category_id, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, sku, price, category_id || null, description || '', image_url || '']
    );
    await logAudit({ userId: session.user.id, entity: 'product', entityId: result.insertId, action: 'create', changes: { name: { to: name }, sku: { to: sku }, price: { to: price } } });
    return res.status(201).json({ id: result.insertId });
  }

  res.status(405).json({ error: 'Method not allowed' });
}