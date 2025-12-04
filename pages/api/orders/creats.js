// pages/api/orders/creats.js
import pool from '../../../lib/db';
import generateOrderId from '../../../utils/generateOrderId';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { items, total, customer } = req.body;

  if (!items || items.length === 0 || !total || !customer) {
    return res.status(400).json({ message: 'اطلاعات سفارش ناقص است' });
  }

  try {
    // ایجاد سفارش جدید
    const orderCode = generateOrderId();
    const [result] = await pool.query(
      'INSERT INTO orders (email, total, status) VALUES (?, ?, ?)',
      [customer.email, total, 'در انتظار پرداخت']
    );

    const orderId = result.insertId;

    // ذخیره آیتم‌های سفارش
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, title, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id || null, item.title, item.price, item.quantity]
      );
    }

    // آدرس درگاه پرداخت (فعلاً فرضی)
    const fakeGatewayUrl = `https://example.com/pay/${orderId}`;

    res.status(201).json({
      orderId,
      orderCode,
      payUrl: fakeGatewayUrl,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'خطا در ثبت سفارش' });
  }
}