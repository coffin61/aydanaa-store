// pages/api/audit/index.js
import db from '../../../lib/db';
import { requireRole } from '../../../lib/authGuard';

export default async function handler(req, res) {
  const session = await requireRole(req, res, ['admin']);
  if (!session) return;

  if (req.method === 'GET') {
    const [rows] = await db.query(`
      SELECT a.*, u.name AS user_name
      FROM audits a
      LEFT JOIN users u ON u.id = a.user_id
      ORDER BY a.id DESC
    `);
    return res.status(200).json(rows);
  }

  res.status(405).json({ error: 'Method not allowed' });
}