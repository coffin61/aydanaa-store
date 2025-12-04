// pages/api/orders/index.js
import db from '../../../lib/db';
import { requireRole } from '../../../lib/authGuard';
import { logAudit } from '../../../lib/audit';

export default async function handler(req, res) {
  // فقط ادمین و اپراتور اجازه دسترسی دارند
  const session = await requireRole(req, res, ['admin', 'operator']);
  if (!session) return;

  if (req.method === 'POST') {
    const { customerName, customerEmail, items, totalPrice } = req.body;

    if (!customerName || !customerEmail || !items?.length || !totalPrice) {
      return res.status(400).json({ message: 'اطلاعات سفارش ناقص است' });
    }

    // ایجاد سفارش
    const [result] = await db.query(
      'INSERT INTO orders (customer_name, customer_phone, address, status, total, note) VALUES (?, ?, ?, ?, ?, ?)',
      [customerName, customerEmail, '', 'pending', totalPrice, '']
    );

    const orderId = result.insertId;

    // افزودن آیتم‌ها
    for (const it of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, category_name) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, it.product_id || null, it.product_name, it.quantity, it.unit_price, it.category_name || null]
      );
    }

    await logAudit({
      userId: session.user.id,
      entity: 'order',
      entityId: orderId,
      action: 'create',
      changes: { total: { to: totalPrice }, status: { to: 'pending' } }
    });

    return res.status(201).json({ message: 'سفارش ثبت شد', id: orderId });
  }

  if (req.method === 'GET') {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY id DESC');
    return res.status(200).json({ orders });
  }

  res.status(405).json({ error: 'Method not allowed' });
}