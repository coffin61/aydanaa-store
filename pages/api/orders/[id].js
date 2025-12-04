// pages/api/orders/[id].js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'متد مجاز نیست' });
  }

  try {
    // گرفتن اطلاعات سفارش
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'سفارشی یافت نشد' });
    }

    const order = orders[0];

    // گرفتن آیتم‌های سفارش
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);

    // ترکیب سفارش و آیتم‌ها
    const result = {
      id: order.id,
      email: order.email,
      total: order.total,
      status: order.status,
      paymentRef: order.paymentRef,
      created_at: order.created_at,
      items: items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('❌ خطا در دریافت سفارش:', err);
    return res.status(500).json({ message: 'خطا در دریافت سفارش', error: err.message });
  }
}