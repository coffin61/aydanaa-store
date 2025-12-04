// pages/api/stats.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id,
        o.date,
        o.status,
        o.total,
        oi.product_title AS title,
        oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ORDER BY o.date DESC
    `);

    // تبدیل داده‌ها به ساختار مناسب برای داشبورد
    const formattedOrders = [];
    const orderMap = {};

    rows.forEach((row) => {
      if (!orderMap[row.id]) {
        orderMap[row.id] = {
          id: row.id,
          date: row.date,
          status: row.status,
          total: row.total,
          items: [],
        };
        formattedOrders.push(orderMap[row.id]);
      }
      if (row.title) {
        orderMap[row.id].items.push({
          title: row.title,
          quantity: row.quantity,
        });
      }
    });

    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error('خطا در گرفتن آمار:', error);
    res.status(500).json({ error: 'خطا در اتصال به دیتابیس یا اجرای کوئری' });
  }
}